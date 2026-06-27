<?php

namespace App\Services;

use App\Data\ParsedMeetingRequest;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class NlpSchedulingService
{
    private const DEFAULT_DURATION_MINUTES = 60;

    public function parse(string $text, User $organizer): ParsedMeetingRequest
    {
        $text = trim($text);

        if ($text === '') {
            return $this->emptyProposal($text, ['Text is required.']);
        }

        if ($this->llmConfigured()) {
            try {
                return $this->parseWithLlm($text, $organizer);
            } catch (\Throwable) {
                // Fall back to rules when LLM is unavailable.
            }
        }

        return $this->parseWithRules($text, $organizer);
    }

    private function llmConfigured(): bool
    {
        return (bool) config('services.openai.api_key');
    }

    private function parseWithLlm(string $text, User $organizer): ParsedMeetingRequest
    {
        $tz = config('app.timezone');
        $now = Carbon::now($tz)->toIso8601String();
        $users = User::query()
            ->where('id', '!=', $organizer->id)
            ->get(['id', 'name', 'role'])
            ->map(fn (User $u) => "{$u->name} ({$u->role}, id:{$u->id})")
            ->implode('; ');
        $rooms = Room::query()
            ->get(['id', 'name', 'building'])
            ->map(fn (Room $r) => "{$r->name} in {$r->building} (id:{$r->id})")
            ->implode('; ');

        $systemPrompt = <<<PROMPT
You extract meeting scheduling intent for a university scheduler in timezone {$tz}.
Return ONLY valid JSON with these keys:
- intent: "book" | "reschedule" | "cancel" | "unknown"
- title: string or null
- description: string or null
- start_time: ISO8601 datetime in {$tz} or null
- end_time: ISO8601 datetime in {$tz} or null (default 60 min after start if omitted)
- participant_names: array of full or partial names mentioned
- room_name: string or null
- confidence: number 0-1

Known users: {$users}
Known rooms: {$rooms}
Current user: {$organizer->name} (organizer, not a participant unless explicitly included)
Today: {$now}
PROMPT;

        $response = Http::withToken(config('services.openai.api_key'))
            ->timeout((int) config('services.openai.timeout', 30))
            ->post(rtrim(config('services.openai.base_url'), '/').'/chat/completions', [
                'model' => config('services.openai.model'),
                'temperature' => 0.1,
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $text],
                ],
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('LLM request failed: '.$response->status());
        }

        $content = $response->json('choices.0.message.content');
        if (! is_string($content)) {
            throw new \RuntimeException('Invalid LLM response shape.');
        }

        /** @var array<string, mixed> $payload */
        $payload = json_decode($content, true, 512, JSON_THROW_ON_ERROR);

        return $this->buildProposal(
            text: $text,
            intent: (string) ($payload['intent'] ?? 'unknown'),
            title: isset($payload['title']) ? (string) $payload['title'] : null,
            description: isset($payload['description']) ? (string) $payload['description'] : null,
            startTime: isset($payload['start_time']) ? (string) $payload['start_time'] : null,
            endTime: isset($payload['end_time']) ? (string) $payload['end_time'] : null,
            participantNames: array_values(array_filter(
                array_map('strval', $payload['participant_names'] ?? []),
            )),
            roomName: isset($payload['room_name']) ? (string) $payload['room_name'] : null,
            confidence: (float) ($payload['confidence'] ?? 0.75),
            parser: 'llm',
            organizer: $organizer,
        );
    }

    private function parseWithRules(string $text, User $organizer): ParsedMeetingRequest
    {
        $lower = Str::lower($text);

        $intent = 'book';
        if (Str::contains($lower, ['cancel', 'delete meeting'])) {
            $intent = 'cancel';
        } elseif (Str::contains($lower, ['reschedule', 'move meeting', 'change time'])) {
            $intent = 'reschedule';
        }

        $title = $this->extractTitle($text);
        $participantNames = $this->extractParticipantNames($text);
        $roomName = $this->extractRoomName($text);
        [$startTime, $endTime] = $this->extractDateTimes($text);

        return $this->buildProposal(
            text: $text,
            intent: $intent,
            title: $title,
            description: null,
            startTime: $startTime,
            endTime: $endTime,
            participantNames: $participantNames,
            roomName: $roomName,
            confidence: $startTime ? 0.65 : 0.4,
            parser: 'rules',
            organizer: $organizer,
        );
    }

    /**
     * @param  array<string>  $participantNames
     */
    private function buildProposal(
        string $text,
        string $intent,
        ?string $title,
        ?string $description,
        ?string $startTime,
        ?string $endTime,
        array $participantNames,
        ?string $roomName,
        float $confidence,
        string $parser,
        User $organizer,
    ): ParsedMeetingRequest {
        $tz = config('app.timezone');
        $errors = [];

        $normalizedStart = $this->normalizeDateTime($startTime, $tz);
        $normalizedEnd = $this->normalizeDateTime($endTime, $tz);

        if ($normalizedStart && ! $normalizedEnd) {
            $normalizedEnd = Carbon::parse($normalizedStart, $tz)
                ->addMinutes(self::DEFAULT_DURATION_MINUTES)
                ->toIso8601String();
        }

        if ($normalizedStart && $normalizedEnd) {
            $start = Carbon::parse($normalizedStart, $tz);
            $end = Carbon::parse($normalizedEnd, $tz);
            if ($end->lte($start)) {
                $errors[] = 'End time must be after start time.';
            }
        }

        $participantIds = $this->resolveParticipantIds($participantNames, $organizer->id);
        if ($participantNames !== [] && $participantIds === []) {
            $errors[] = 'Could not match mentioned participants to registered users.';
        }

        $roomId = $this->resolveRoomId($roomName);
        if ($roomName && $roomId === null) {
            $errors[] = 'Could not match mentioned room to registered rooms.';
        }

        if ($intent === 'book' && ! $normalizedStart) {
            $errors[] = 'Could not determine meeting date and time — please edit before booking.';
        }

        if (! $title) {
            $title = $intent === 'book' ? 'Meeting' : ucfirst($intent).' request';
        }

        return new ParsedMeetingRequest(
            intent: $intent,
            title: $title,
            description: $description,
            startTime: $normalizedStart,
            endTime: $normalizedEnd,
            participantIds: $participantIds,
            participantNames: $participantNames,
            roomId: $roomId,
            roomName: $roomName,
            confidence: $confidence,
            parser: $parser,
            rawText: $text,
            validationErrors: $errors,
        );
    }

    private function emptyProposal(string $text, array $errors): ParsedMeetingRequest
    {
        return new ParsedMeetingRequest(
            intent: 'unknown',
            title: null,
            description: null,
            startTime: null,
            endTime: null,
            participantIds: [],
            participantNames: [],
            roomId: null,
            roomName: null,
            confidence: 0,
            parser: 'rules',
            rawText: $text,
            validationErrors: $errors,
        );
    }

    private function extractTitle(string $text): ?string
    {
        if (preg_match('/(?:about|regarding|for)\s+(.+?)(?:\s+(?:with|on|at|next|tomorrow|today)\b|$)/i', $text, $m)) {
            return Str::title(trim($m[1], " .,\t\n\r\0\x0B"));
        }

        if (preg_match('/\b(supervision|consultation|project meeting|group meeting)\b/i', $text, $m)) {
            return Str::title($m[1]);
        }

        return null;
    }

    /**
     * @return array<string>
     */
    private function extractParticipantNames(string $text): array
    {
        $names = [];

        if (preg_match('/\bwith\s+(?:dr\.?\s+)?([a-z][a-z\s\'.-]+?)(?:\s+(?:next|on|at|tomorrow|today|in)\b|[,.]|$)/i', $text, $m)) {
            $names[] = trim($m[1]);
        }

        if (preg_match('/\b(?:dr\.?\s+)?([a-z]+)\s+lecturer\b/i', $text, $m)) {
            $names[] = trim($m[0]);
        }

        return array_values(array_unique(array_filter($names)));
    }

    private function extractRoomName(string $text): ?string
    {
        if (preg_match('/\b(ENG-\d+|SCI-\d+)\b/i', $text, $m)) {
            return Str::upper($m[1]);
        }

        if (preg_match('/\b(engineering|science)\b/i', $text, $m)) {
            return Str::lower($m[1]) === 'engineering' ? 'ENG-101' : 'SCI-202';
        }

        return null;
    }

    /**
     * @return array{0: ?string, 1: ?string}
     */
    private function extractDateTimes(string $text): array
    {
        $tz = config('app.timezone');
        $base = Carbon::now($tz);

        $datePhrase = null;
        foreach (['next tuesday', 'next monday', 'next wednesday', 'next thursday', 'next friday', 'tomorrow', 'today'] as $phrase) {
            if (Str::contains(Str::lower($text), $phrase)) {
                $datePhrase = $phrase;
                break;
            }
        }

        if (! $datePhrase && preg_match('/\b(monday|tuesday|wednesday|thursday|friday)\b/i', $text, $m)) {
            $datePhrase = 'next '.Str::lower($m[1]);
        }

        $time = null;
        if (preg_match('/\bat\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i', $text, $m)) {
            $time = trim($m[1]);
        } elseif (preg_match('/\b(\d{1,2}:\d{2})\b/', $text, $m)) {
            $time = $m[1];
        }

        if (! $datePhrase && ! $time) {
            return [null, null];
        }

        $combined = trim(($datePhrase ?? 'tomorrow').($time ? ' at '.$time : ' at 10:00'));

        try {
            $start = Carbon::parse($combined, $tz);
            if ($start->isPast()) {
                $start = $start->addWeek();
            }
            $end = $start->copy()->addMinutes(self::DEFAULT_DURATION_MINUTES);

            return [$start->toIso8601String(), $end->toIso8601String()];
        } catch (\Throwable) {
            return [null, null];
        }
    }

    private function normalizeDateTime(?string $value, string $tz): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        try {
            return Carbon::parse($value, $tz)->toIso8601String();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @param  array<string>  $names
     * @return array<int>
     */
    private function resolveParticipantIds(array $names, int $organizerId): array
    {
        $ids = [];

        foreach ($names as $name) {
            $needle = Str::lower(trim($name));
            if ($needle === '') {
                continue;
            }

            $user = User::query()
                ->where('id', '!=', $organizerId)
                ->where(function ($q) use ($needle) {
                    $q->whereRaw('LOWER(name) LIKE ?', ['%'.$needle.'%'])
                        ->orWhereRaw('LOWER(name) LIKE ?', ['%'.str_replace(' ', '%', $needle).'%']);
                })
                ->first();

            if ($user) {
                $ids[] = $user->id;
            }
        }

        return array_values(array_unique($ids));
    }

    private function resolveRoomId(?string $roomName): ?int
    {
        if ($roomName === null || trim($roomName) === '') {
            return null;
        }

        $room = Room::query()
            ->whereRaw('LOWER(name) LIKE ?', ['%'.Str::lower(trim($roomName)).'%'])
            ->first();

        return $room?->id;
    }
}
