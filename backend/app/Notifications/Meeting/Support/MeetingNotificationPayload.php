<?php

namespace App\Notifications\Meeting\Support;

use App\Models\Meeting;
use Carbon\Carbon;

class MeetingNotificationPayload
{
    /**
     * @param  list<string>  $changes
     * @return array<string, mixed>
     */
    public static function build(Meeting $meeting, string $action, array $changes = []): array
    {
        $meeting->loadMissing(['organizer', 'room']);

        $frontendUrl = rtrim((string) config('app.frontend_url', 'http://localhost:3000'), '/');
        $joinUrl = $meeting->meeting_mode === Meeting::MODE_EXTERNAL && filled($meeting->meeting_url)
            ? $meeting->meeting_url
            : "{$frontendUrl}/dashboard/meetings/{$meeting->id}/join";

        $organizerName = $meeting->organizer?->name ?? 'Someone';
        $timeRange = self::formatTimeRange($meeting->start_time, $meeting->end_time);

        $message = match ($action) {
            'created' => "{$organizerName} invited you to {$meeting->title}",
            'updated' => "{$meeting->title} was rescheduled or updated",
            'cancelled' => "{$meeting->title} was cancelled by {$organizerName}",
            default => "Update for {$meeting->title}",
        };

        $emailSubject = match ($action) {
            'created' => "You were invited: {$meeting->title}",
            'updated' => "Meeting updated: {$meeting->title}",
            'cancelled' => "Meeting cancelled: {$meeting->title}",
            default => "Meeting notification: {$meeting->title}",
        };

        return [
            'action' => $action,
            'type' => $action,
            'meeting_id' => $meeting->id,
            'title' => $meeting->title,
            'message' => $message,
            'email_subject' => $emailSubject,
            'organizer_name' => $organizerName,
            'time_range' => $timeRange,
            'room_name' => $meeting->room?->name,
            'join_url' => $action === 'cancelled' ? null : $joinUrl,
            'changes' => array_values(array_unique($changes)),
        ];
    }

    private static function formatTimeRange(Carbon $start, Carbon $end): string
    {
        $date = $start->timezone(config('app.timezone'))->format('D, j M Y');
        $startTime = $start->timezone(config('app.timezone'))->format('g:i A');
        $endTime = $end->timezone(config('app.timezone'))->format('g:i A');

        return "{$date} · {$startTime} – {$endTime}";
    }
}
