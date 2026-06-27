<?php

namespace App\Services;

use App\Models\ClashRecord;
use App\Models\ConstraintRule;
use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ClashDetectionService
{
    /**
     * @return array<int, array{type: string, message: string}>
     */
    public function detect(
        Carbon $start,
        Carbon $end,
        array $participantIds,
        ?int $roomId,
        ?int $excludeMeetingId = null,
    ): array {
        $clashes = [];

        if ($end->lte($start)) {
            $clashes[] = [
                'type' => 'time',
                'message' => 'End time must be after start time.',
            ];

            return $clashes;
        }

        foreach ($participantIds as $participantId) {
            $clashes = array_merge(
                $clashes,
                $this->detectParticipantTimeClash($participantId, $start, $end, $excludeMeetingId),
            );
            $clashes = array_merge(
                $clashes,
                $this->detectAvailabilityClash($participantId, $start, $end),
            );
        }

        if ($roomId) {
            $clashes = array_merge(
                $clashes,
                $this->detectRoomClash($roomId, $start, $end, $excludeMeetingId),
            );
        }

        $clashes = array_merge($clashes, $this->detectPolicyClashes($start, $end));

        return $clashes;
    }

    /**
     * @return array<int, array{type: string, message: string}>
     */
    private function detectParticipantTimeClash(
        int $userId,
        Carbon $start,
        Carbon $end,
        ?int $excludeMeetingId,
    ): array {
        $query = Meeting::query()
            ->where('status', 'scheduled')
            ->where(function ($q) use ($start, $end) {
                $q->where('start_time', '<', $end)
                    ->where('end_time', '>', $start);
            })
            ->where(function ($q) use ($userId) {
                $q->where('organizer_id', $userId)
                    ->orWhereHas('participants', fn ($p) => $p->where('user_id', $userId));
            });

        if ($excludeMeetingId) {
            $query->where('id', '!=', $excludeMeetingId);
        }

        if (! $query->exists()) {
            return [];
        }

        $user = User::find($userId);

        return [[
            'type' => 'participant',
            'message' => sprintf(
                '%s has another meeting during this time.',
                $user?->name ?? 'Participant',
            ),
        ]];
    }

    /**
     * @return array<int, array{type: string, message: string}>
     */
    private function detectAvailabilityClash(int $userId, Carbon $start, Carbon $end): array
    {
        $user = User::with('availabilities')->find($userId);

        if (! $user || $user->availabilities->isEmpty()) {
            return [];
        }

        $dayOfWeek = $start->dayOfWeek;
        $slots = $user->availabilities->where('day_of_week', $dayOfWeek);

        if ($slots->isEmpty()) {
            return [[
                'type' => 'availability',
                'message' => sprintf('%s is not available on this day.', $user->name),
            ]];
        }

        $startMinutes = $this->minutesSinceMidnight($start);
        $endMinutes = $this->minutesSinceMidnight($end);

        $withinSlot = $slots->contains(function ($slot) use ($startMinutes, $endMinutes) {
            return $startMinutes >= $this->minutesSinceMidnight($slot->start_time)
                && $endMinutes <= $this->minutesSinceMidnight($slot->end_time);
        });

        if ($withinSlot) {
            return [];
        }

        return [[
            'type' => 'availability',
            'message' => sprintf('%s is outside declared availability hours.', $user->name),
        ]];
    }

    /**
     * @return array<int, array{type: string, message: string}>
     */
    private function detectRoomClash(
        int $roomId,
        Carbon $start,
        Carbon $end,
        ?int $excludeMeetingId,
    ): array {
        $query = Meeting::query()
            ->where('room_id', $roomId)
            ->where('status', 'scheduled')
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start);

        if ($excludeMeetingId) {
            $query->where('id', '!=', $excludeMeetingId);
        }

        if (! $query->exists()) {
            return [];
        }

        return [[
            'type' => 'room',
            'message' => 'The selected room is already booked for this time.',
        ]];
    }

    /**
     * @return array<int, array{type: string, message: string}>
     */
    private function detectPolicyClashes(Carbon $start, Carbon $end): array
    {
        $clashes = [];

        $blackouts = ConstraintRule::query()
            ->where('is_active', true)
            ->where('rule_type', 'exam_blackout')
            ->where(function ($q) use ($start) {
                $q->whereNull('valid_from')->orWhere('valid_from', '<=', $start->toDateString());
            })
            ->where(function ($q) use ($start) {
                $q->whereNull('valid_to')->orWhere('valid_to', '>=', $start->toDateString());
            })
            ->get();

        foreach ($blackouts as $rule) {
            $clashes[] = [
                'type' => 'policy',
                'message' => sprintf('Booking blocked: %s.', $rule->name),
            ];
        }

        return $clashes;
    }

    /**
     * Normalize TIME columns and Carbon instances to minutes since midnight.
     */
    private function minutesSinceMidnight(mixed $value): int
    {
        if ($value instanceof Carbon) {
            return $value->hour * 60 + $value->minute;
        }

        $time = Carbon::parse($value)->format('H:i:s');
        [$hour, $minute] = array_map('intval', explode(':', $time));

        return $hour * 60 + $minute;
    }

    public function logClashes(?Meeting $meeting, array $clashes): void
    {
        foreach ($clashes as $clash) {
            ClashRecord::create([
                'meeting_id' => $meeting?->id,
                'clash_type' => $clash['type'],
                'message' => $clash['message'],
                'resolved' => false,
            ]);
        }
    }
}
