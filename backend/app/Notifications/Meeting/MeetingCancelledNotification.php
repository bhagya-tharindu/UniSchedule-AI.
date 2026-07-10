<?php

namespace App\Notifications\Meeting;

use App\Models\Meeting;
use App\Notifications\Meeting\Support\MeetingNotificationPayload;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Meeting $meeting) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $payload = MeetingNotificationPayload::build($this->meeting, 'cancelled');

        return (new MailMessage)
            ->subject($payload['email_subject'])
            ->greeting('Hello '.$notifiable->name.',')
            ->line($payload['message'])
            ->line('Originally scheduled: '.$payload['time_range']);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return MeetingNotificationPayload::build($this->meeting, 'cancelled');
    }
}
