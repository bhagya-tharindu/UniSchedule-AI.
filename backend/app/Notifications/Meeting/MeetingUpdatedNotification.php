<?php

namespace App\Notifications\Meeting;

use App\Models\Meeting;
use App\Notifications\Meeting\Support\MeetingNotificationPayload;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param  list<string>  $changes
     */
    public function __construct(
        private readonly Meeting $meeting,
        private readonly array $changes = [],
    ) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $payload = MeetingNotificationPayload::build($this->meeting, 'updated', $this->changes);

        $mail = (new MailMessage)
            ->subject($payload['email_subject'])
            ->greeting('Hello '.$notifiable->name.',')
            ->line($payload['message'])
            ->line('When: '.$payload['time_range']);

        if (! empty($payload['changes'])) {
            $mail->line('Changes: '.implode(', ', array_map(
                fn (string $change) => str_replace('_', ' ', $change),
                $payload['changes'],
            )));
        }

        if ($payload['room_name']) {
            $mail->line('Room: '.$payload['room_name']);
        }

        if ($payload['join_url']) {
            $mail->action('View meeting', $payload['join_url']);
        }

        return $mail;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return MeetingNotificationPayload::build($this->meeting, 'updated', $this->changes);
    }
}
