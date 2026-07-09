<?php

namespace App\Services;

use App\Data\ParsedMeetingRequest;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NlpSchedulingService
{
    private const DEFAULT_DURATION_MINUTES = 60;

    public function parse(string $text, User $organizer, ?string $meetingMode = null): ParsedMeetingRequest
    {
        $text = trim($text);

        if ($text === '') {
            return $this->emptyProposal($text, ['Text is required.']);
        }

        $online = $this->isOnlineDelivery($text, $meetingMode);

        if ($this->llmConfigured()) {
            try {
                return $this->parseWithLlm($text, $organizer, $online);
            } catch (\Throwable $e) {
                Log::warning('NLP LLM parse failed; using rule-based fallback', [
                    'message' => $e->getMessage(),
                    'base_url' => config('services.openai.base_url'),
                    'model' => config('services.openai.model'),
                    'key_configured' => (bool) config('services.openai.api_key'),
                ]);
            }
        } else {
            Log::info('NLP LLM not configured; using rule-based parser');
        }

        return $this->parseWithRules($text, $organizer, $online);
    }

    /**
     * Jitsi / external meetings (or online wording) do not use campus classrooms.
     */
    private function isOnlineDelivery(string $text, ?string $meetingMode): bool
    {
        if (in_array($meetingMode, ['jitsi', 'external'], true)) {
            return true;
        }

        $lower = Str::lower($text);

        return Str::contains($lower, [
            'online',
            'jitsi',
            'zoom',
            'teams',
            'virtual',
            'video call',
            'video meeting',
            'google meet',
            'meet.google',
        ]);
    }

    private function llmConfigured(): bool
    {
        $key = config('services.openai.api_key');

        return is_string($key) && trim($key) !== '';
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     */
    private function requestChatCompletion(string $url, array $messages, bool $withJsonFormat): string
    {
        $payload = [
            'model' => config('services.openai.model'),
            'temperature' => 0.1,
            'messages' => $messages,
        ];

        if ($withJsonFormat) {
            $payload['response_format'] = ['type' => 'json_object'];
        }

        $http = Http::withToken((string) config('services.openai.api_key'))
            ->acceptJson()
            ->timeout((int) config('services.openai.timeout', 30));

        // Local Windows PHP often lacks CA certs (cURL error 60).
        if (config('services.openai.verify_ssl') === false) {
            $http = $http->withoutVerifying();
        }

        $response = $http->post($url, $payload);

        // Retry once without response_format (some Groq models reject it).
        if (! $response->successful() && $withJsonFormat) {
            Log::warning('NLP LLM request failed with response_format; retrying without it', [
                'url' => $url,
                'model' => config('services.openai.model'),
                'status' => $response->status(),
                'body' => Str::limit($response->body(), 500),
            ]);

            return $this->requestChatCompletion($url, $messages, withJsonFormat: false);
        }

        if (! $response->successful()) {
            throw new \RuntimeException(
                'LLM request failed: '.$response->status().' '.Str::limit($response->body(), 800)
            );
        }

        Log::info('NLP LLM request succeeded', [
            'url' => $url,
            'model' => config('services.openai.model'),
            'status' => $response->status(),
        ]);

        $content = $response->json('choices.0.message.content');
        if (! is_string($content) || trim($content) === '') {
            throw new \RuntimeException('Invalid LLM response shape: missing message content.');
        }

        return $content;
    }

    /**
     * @return array<string, mixed>
     */
    private function decodeJsonContent(string $content): array
    {
        $content = trim($content);

        // Models sometimes wrap JSON in ```json ... ```
        if (preg_match('/```(?:json)?\s*(\{.*\})\s*```/s', $content, $m)) {
            $content = $m[1];
        } elseif (! str_starts_with($content, '{')) {
            $start = strpos($content, '{');
            $end = strrpos($content, '}');
            if ($start !== false && $end !== false && $end > $start) {
                $content = substr($content, $start, $end - $start + 1);
            }
        }

        try {
            /** @var array<string, mixed> $decoded */
            $decoded = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw new \RuntimeException('LLM returned non-JSON content: '.Str::limit($content, 300), 0, $e);
        }

        return $decoded;
    }

    private function parseWithLlm(string $text, User $organizer, bool $online = false): ParsedMeetingRequest
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

        $roomInstruction = $online
            ? 'This is an ONLINE meeting (Jitsi/video). Always set room_name to null even if a campus room code is mentioned.'
            : 'room_name: campus room code if mentioned (e.g. ENG-101), otherwise null.';

        $systemPrompt = <<<PROMPT
You extract meeting scheduling intent for a university scheduler in timezone {$tz}.
Return ONLY valid JSON with these keys:
- intent: "book" | "reschedule" | "cancel" | "unknown"
- title: string or null
- description: string or null
- start_time: ISO8601 datetime in {$tz} or null
- end_time: ISO8601 datetime in {$tz} or null (default 60 min after start if omitted)
- participant_names: array of full or partial names mentioned (include titles like Dr)
- room_name: string or null
- confidence: number 0-1

{$roomInstruction}

Known users: {$users}
Known rooms: {$rooms}
Current user: {$organizer->name} (organizer, not a participant unless explicitly included)
Today: {$now}
PROMPT;

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $text],
        ];

        $url = rtrim((string) config('services.openai.base_url'), '/').'/chat/completions';
        $content = $this->requestChatCompletion($url, $messages, withJsonFormat: true);

        /** @var array<string, mixed> $payload */
        $payload = $this->decodeJsonContent($content);

        $roomName = $online
            ? null
            : (isset($payload['room_name']) ? (string) $payload['room_name'] : null);

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
            roomName: $roomName,
            confidence: (float) ($payload['confidence'] ?? 0.75),
            parser: 'llm',
            organizer: $organizer,
            online: $online,
        );
    }

    private function parseWithRules(string $text, User $organizer, bool $online = false): ParsedMeetingRequest
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
        $roomName = $online ? null : $this->extractRoomName($text);
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
            online: $online,
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
        bool $online = false,
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

        // Online (Jitsi / external) never binds a campus classroom.
        $resolvedRoomName = $online ? null : $roomName;
        $roomId = $online ? null : $this->resolveRoomId($resolvedRoomName);
        if (! $online && $resolvedRoomName && $roomId === null) {
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
            roomName: $resolvedRoomName,
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

        // Prefer full academic names: "Dr Jane Lecturer"
        if (preg_match('/\bwith\s+(dr\.?\s+[a-z]+(?:\s+[a-z]+)+)/i', $text, $m)) {
            $names[] = trim(preg_replace('/\s+/', ' ', $m[1]));
        } elseif (preg_match('/\bwith\s+([a-z][a-z\s\'.-]+?)(?:\s+(?:next|on|at|tomorrow|today|in|online)\b|[,.]|$)/i', $text, $m)) {
            $names[] = trim($m[1]);
        }

        if (preg_match('/\b(dr\.?\s+[a-z]+\s+lecturer)\b/i', $text, $m)) {
            $names[] = trim(preg_replace('/\s+/', ' ', $m[1]));
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
