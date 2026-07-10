<?php

namespace App\Services;

use App\Models\Meeting;
use App\Models\User;
use App\Notifications\Meeting\MeetingCancelledNotification;
use App\Notifications\Meeting\MeetingCreatedNotification;
use App\Notifications\Meeting\MeetingUpdatedNotification;
use Illuminate\Support\Collection;

class MeetingNotificationService
{
    public function notifyCreated(Meeting $meeting): void
    {
        $this->send($meeting, new MeetingCreatedNotification($meeting));
    }

    /**
     * @param  list<string>  $changes
     */
    public function notifyUpdated(Meeting $meeting, array $changes): void
    {
        if ($changes === []) {
            return;
        }

        $this->send($meeting, new MeetingUpdatedNotification($meeting, $changes));
    }

    public function notifyCancelled(Meeting $meeting): void
    {
        $this->send($meeting, new MeetingCancelledNotification($meeting));
    }

    /**
     * @param  array<string, mixed>  $snapshot
     * @param  list<int>  $newParticipantIds
     * @return list<string>
     */
    public function buildChangeSummary(array $snapshot, Meeting $meeting, array $newParticipantIds): array
    {
        $changes = [];

        if (($snapshot['title'] ?? null) !== $meeting->title) {
            $changes[] = 'title_changed';
        }

        if (! $snapshot['start_time']->equalTo($meeting->start_time)
            || ! $snapshot['end_time']->equalTo($meeting->end_time)) {
            $changes[] = 'time_changed';
        }

        if (($snapshot['room_id'] ?? null) !== $meeting->room_id) {
            $changes[] = 'room_changed';
        }

        $oldIds = collect($snapshot['participant_ids'] ?? [])->sort()->values()->all();
        $newIds = collect($newParticipantIds)->sort()->values()->all();

        if ($oldIds !== $newIds) {
            $changes[] = 'participants_changed';
        }

        if (($snapshot['description'] ?? null) !== $meeting->description) {
            $changes[] = 'details_changed';
        }

        return array_values(array_unique($changes));
    }

    private function send(Meeting $meeting, object $notification): void
    {
        foreach ($this->recipients($meeting) as $recipient) {
            $recipient->notify($notification);
        }
    }

    /**
     * @return Collection<int, User>
     */
    private function recipients(Meeting $meeting): Collection
    {
        $meeting->loadMissing('participants.user');

        return $meeting->participants
            ->pluck('user')
            ->filter()
            ->filter(fn (User $user) => $user->id !== $meeting->organizer_id)
            ->unique('id')
            ->values();
    }
}
