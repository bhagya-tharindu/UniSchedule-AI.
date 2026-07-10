<?php

namespace App\Services;

use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SchedulingService
{
    public function __construct(
        private readonly ClashDetectionService $clashDetection,
        private readonly MeetingNotificationService $meetingNotifications,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function createMeeting(array $data, int $organizerId): Meeting
    {
        return $this->persistMeeting($data, $organizerId);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateMeeting(Meeting $meeting, array $data): Meeting
    {
        if ($meeting->status === 'cancelled') {
            throw ValidationException::withMessages([
                'meeting' => ['Cancelled meetings cannot be updated.'],
            ]);
        }

        if ($meeting->end_time->isPast()) {
            throw ValidationException::withMessages([
                'meeting' => ['Finished meetings cannot be updated.'],
            ]);
        }

        $payload = array_merge([
            'title' => $meeting->title,
            'description' => $meeting->description,
            'start_time' => $meeting->start_time->toDateTimeString(),
            'end_time' => $meeting->end_time->toDateTimeString(),
            'room_id' => $meeting->room_id,
            'participant_ids' => $meeting->participants()->pluck('user_id')->all(),
            'meeting_mode' => $meeting->meeting_mode,
            'meeting_url' => $meeting->meeting_url,
        ], $data);

        return $this->persistMeeting($payload, $meeting->organizer_id, $meeting->id, $meeting);
    }

    public function cancelMeeting(Meeting $meeting): Meeting
    {
        if ($meeting->end_time->isPast()) {
            throw ValidationException::withMessages([
                'meeting' => ['Finished meetings cannot be cancelled.'],
            ]);
        }

        $meeting->update(['status' => 'cancelled']);

        $meeting = $meeting->fresh(['room', 'organizer', 'participants.user']);

        $this->meetingNotifications->notifyCancelled($meeting);

        return $meeting;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function persistMeeting(
        array $data,
        int $organizerId,
        ?int $excludeMeetingId = null,
        ?Meeting $existing = null,
    ): Meeting
    {
        $tz = config('app.timezone');
        $start = Carbon::parse($data['start_time'], $tz);
        $end = Carbon::parse($data['end_time'], $tz);
        $participantIds = collect($data['participant_ids'] ?? [])
            ->push($organizerId)
            ->unique()
            ->values()
            ->all();

        $roomId = $data['room_id'] ?? null;

        if ($roomId) {
            $this->validateRoomCapacity($roomId, $participantIds);
        }

        $clashes = $this->clashDetection->detect(
            $start,
            $end,
            $participantIds,
            $roomId,
            $excludeMeetingId,
        );

        if (! empty($clashes) && ! ($data['force'] ?? false)) {
            throw ValidationException::withMessages([
                'clashes' => $clashes,
            ]);
        }

        [$meetingMode, $meetingUrl] = $this->resolveMeetingDelivery($data, $existing);

        $snapshot = $existing ? [
            'title' => $existing->title,
            'description' => $existing->description,
            'start_time' => $existing->start_time->copy(),
            'end_time' => $existing->end_time->copy(),
            'room_id' => $existing->room_id,
            'participant_ids' => $existing->participants()->pluck('user_id')->all(),
        ] : null;

        [$meeting, $changes] = DB::transaction(function () use ($data, $organizerId, $participantIds, $start, $end, $roomId, $clashes, $existing, $meetingMode, $meetingUrl, $snapshot) {
            if ($existing) {
                $existing->update([
                    'room_id' => $roomId,
                    'title' => $data['title'],
                    'description' => $data['description'] ?? null,
                    'start_time' => $start,
                    'end_time' => $end,
                    'meeting_mode' => $meetingMode,
                    'meeting_url' => $meetingUrl,
                ]);
                $meeting = $existing;
                $meeting->participants()->delete();
            } else {
                $meeting = Meeting::create([
                    'organizer_id' => $organizerId,
                    'room_id' => $roomId,
                    'title' => $data['title'],
                    'description' => $data['description'] ?? null,
                    'start_time' => $start,
                    'end_time' => $end,
                    'status' => 'scheduled',
                    'meeting_mode' => $meetingMode,
                    'meeting_url' => $meetingUrl,
                ]);
            }

            if ($meetingMode === Meeting::MODE_JITSI && blank($meeting->meeting_url)) {
                $meeting->update([
                    'meeting_url' => $this->buildJitsiUrl($meeting),
                ]);
            }

            foreach ($participantIds as $participantId) {
                MeetingParticipant::create([
                    'meeting_id' => $meeting->id,
                    'user_id' => $participantId,
                    'response' => $participantId === $organizerId ? 'accepted' : 'pending',
                ]);
            }

            if (! empty($clashes)) {
                $this->clashDetection->logClashes($meeting, $clashes);
            }

            $meeting = $meeting->fresh(['room', 'organizer', 'participants.user']);

            $changes = [];
            if ($existing && $snapshot !== null) {
                $changes = $this->meetingNotifications->buildChangeSummary(
                    $snapshot,
                    $meeting,
                    $participantIds,
                );
            }

            return [$meeting, $changes];
        });

        if ($existing) {
            $this->meetingNotifications->notifyUpdated($meeting, $changes);
        } else {
            $this->meetingNotifications->notifyCreated($meeting);
        }

        return $meeting;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{0: string, 1: ?string}
     */
    private function resolveMeetingDelivery(array $data, ?Meeting $existing = null): array
    {
        $mode = $data['meeting_mode']
            ?? $existing?->meeting_mode
            ?? Meeting::MODE_JITSI;

        if (! in_array($mode, [Meeting::MODE_JITSI, Meeting::MODE_EXTERNAL], true)) {
            $mode = Meeting::MODE_JITSI;
        }

        if ($mode === Meeting::MODE_EXTERNAL) {
            $url = $data['meeting_url'] ?? $existing?->meeting_url;
            if (! is_string($url) || trim($url) === '') {
                throw ValidationException::withMessages([
                    'meeting_url' => ['An external meeting link is required.'],
                ]);
            }

            return [Meeting::MODE_EXTERNAL, trim($url)];
        }

        $url = $data['meeting_url'] ?? $existing?->meeting_url;

        return [Meeting::MODE_JITSI, is_string($url) && $url !== '' ? $url : null];
    }

    private function buildJitsiUrl(Meeting $meeting): string
    {
        $base = rtrim((string) config('services.jitsi.base_url', 'https://meet.jit.si'), '/');
        $slug = Str::slug(Str::limit($meeting->title, 40, ''));
        $room = 'UniSchedule-'.$meeting->id.($slug !== '' ? '-'.$slug : '').'-'.Str::lower(Str::random(6));

        return $base.'/'.$room;
    }

    private function validateRoomCapacity(int $roomId, array $participantIds): void
    {
        $room = Room::findOrFail($roomId);

        if (count($participantIds) > $room->capacity) {
            throw ValidationException::withMessages([
                'room_id' => [sprintf('Room capacity is %d participants.', $room->capacity)],
            ]);
        }
    }

    /**
     * @return \Illuminate\Support\Collection<int, array{start_time: string, end_time: string}>
     */
    public function suggestAlternativeSlots(
        Carbon $requestedStart,
        int $durationMinutes,
        array $participantIds,
        ?int $roomId,
    ): \Illuminate\Support\Collection {
        $suggestions = collect();

        for ($offset = 1; $offset <= 5; $offset++) {
            $candidateStart = $requestedStart->copy()->addHours($offset);
            $candidateEnd = $candidateStart->copy()->addMinutes($durationMinutes);

            $clashes = $this->clashDetection->detect(
                $candidateStart,
                $candidateEnd,
                $participantIds,
                $roomId,
            );

            if (empty($clashes)) {
                $suggestions->push([
                    'start_time' => $candidateStart->toIso8601String(),
                    'end_time' => $candidateEnd->toIso8601String(),
                ]);
            }
        }

        return $suggestions;
    }
}
