<?php

namespace App\Services;

use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SchedulingService
{
    public function __construct(
        private readonly ClashDetectionService $clashDetection,
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

        $payload = array_merge([
            'title' => $meeting->title,
            'description' => $meeting->description,
            'start_time' => $meeting->start_time->toDateTimeString(),
            'end_time' => $meeting->end_time->toDateTimeString(),
            'room_id' => $meeting->room_id,
            'participant_ids' => $meeting->participants()->pluck('user_id')->all(),
        ], $data);

        return $this->persistMeeting($payload, $meeting->organizer_id, $meeting->id, $meeting);
    }

    public function cancelMeeting(Meeting $meeting): Meeting
    {
        $meeting->update(['status' => 'cancelled']);

        return $meeting->fresh(['room', 'organizer', 'participants.user']);
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

        return DB::transaction(function () use ($data, $organizerId, $participantIds, $start, $end, $roomId, $clashes, $existing) {
            if ($existing) {
                $existing->update([
                    'room_id' => $roomId,
                    'title' => $data['title'],
                    'description' => $data['description'] ?? null,
                    'start_time' => $start,
                    'end_time' => $end,
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

            return $meeting->load(['room', 'organizer', 'participants.user']);
        });
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
