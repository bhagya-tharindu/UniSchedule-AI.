<?php

namespace Tests\Feature;

use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\User;
use App\Notifications\Meeting\MeetingCancelledNotification;
use App\Notifications\Meeting\MeetingCreatedNotification;
use App\Notifications\Meeting\MeetingUpdatedNotification;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MeetingNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_meeting_notification_classes_are_queued(): void
    {
        foreach ([
            MeetingCreatedNotification::class,
            MeetingUpdatedNotification::class,
            MeetingCancelledNotification::class,
        ] as $class) {
            $this->assertContains(ShouldQueue::class, class_implements($class) ?: []);
        }
    }

    public function test_creating_meeting_notifies_participants_not_organizer(): void
    {
        Notification::fake();

        $organizer = User::factory()->create();
        $participant = User::factory()->create();
        Sanctum::actingAs($organizer);

        $start = Carbon::now()->addDays(4)->setTime(10, 0);
        $end = (clone $start)->addHour();

        $this->postJson('/api/v1/meetings', [
            'title' => 'Team sync',
            'start_time' => $start->toIso8601String(),
            'end_time' => $end->toIso8601String(),
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$participant->id],
        ])->assertCreated();

        Notification::assertSentTo($participant, MeetingCreatedNotification::class);
        Notification::assertNotSentTo($organizer, MeetingCreatedNotification::class);
    }

    public function test_created_meeting_stores_database_notification_for_participant(): void
    {
        $organizer = User::factory()->create();
        $participant = User::factory()->create();
        Sanctum::actingAs($organizer);

        $start = Carbon::now()->addDays(4)->setTime(11, 0);
        $end = (clone $start)->addHour();

        $this->postJson('/api/v1/meetings', [
            'title' => 'Project review',
            'start_time' => $start->toIso8601String(),
            'end_time' => $end->toIso8601String(),
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$participant->id],
        ])->assertCreated();

        $this->assertSame(1, $participant->fresh()->notifications()->count());
        $this->assertSame(0, $organizer->fresh()->notifications()->count());

        $notification = $participant->notifications()->first();
        $this->assertSame('created', $notification->data['type']);
        $this->assertSame('Project review', $notification->data['title']);
    }

    public function test_updating_meeting_notifies_participants(): void
    {
        Notification::fake();

        $organizer = User::factory()->create();
        $participant = User::factory()->create();
        Sanctum::actingAs($organizer);

        $start = Carbon::now()->addDays(5)->setTime(9, 0);
        $end = (clone $start)->addHour();

        $meeting = Meeting::create([
            'organizer_id' => $organizer->id,
            'title' => 'Original title',
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'scheduled',
            'meeting_mode' => 'jitsi',
            'meeting_url' => 'https://meet.jit.si/test-room',
        ]);

        MeetingParticipant::create([
            'meeting_id' => $meeting->id,
            'user_id' => $organizer->id,
            'response' => 'accepted',
        ]);
        MeetingParticipant::create([
            'meeting_id' => $meeting->id,
            'user_id' => $participant->id,
            'response' => 'pending',
        ]);

        $this->putJson("/api/v1/meetings/{$meeting->id}", [
            'title' => 'Updated title',
            'start_time' => $start->toIso8601String(),
            'end_time' => $end->toIso8601String(),
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$participant->id],
        ])->assertOk();

        Notification::assertSentTo($participant, MeetingUpdatedNotification::class);
        Notification::assertNotSentTo($organizer, MeetingUpdatedNotification::class);
    }

    public function test_cancelling_meeting_notifies_participants(): void
    {
        Notification::fake();

        $organizer = User::factory()->create();
        $participant = User::factory()->create();
        Sanctum::actingAs($organizer);

        $start = Carbon::now()->addDays(6)->setTime(15, 0);
        $end = (clone $start)->addHour();

        $meeting = Meeting::create([
            'organizer_id' => $organizer->id,
            'title' => 'To cancel',
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'scheduled',
            'meeting_mode' => 'jitsi',
            'meeting_url' => 'https://meet.jit.si/cancel-room',
        ]);

        MeetingParticipant::create([
            'meeting_id' => $meeting->id,
            'user_id' => $organizer->id,
            'response' => 'accepted',
        ]);
        MeetingParticipant::create([
            'meeting_id' => $meeting->id,
            'user_id' => $participant->id,
            'response' => 'pending',
        ]);

        $this->deleteJson("/api/v1/meetings/{$meeting->id}")->assertOk();

        Notification::assertSentTo($participant, MeetingCancelledNotification::class);
        Notification::assertNotSentTo($organizer, MeetingCancelledNotification::class);
    }

    public function test_participant_can_list_and_mark_notifications_read(): void
    {
        $organizer = User::factory()->create();
        $participant = User::factory()->create();
        Sanctum::actingAs($organizer);

        $start = Carbon::now()->addDays(7)->setTime(13, 0);
        $end = (clone $start)->addHour();

        $this->postJson('/api/v1/meetings', [
            'title' => 'Notification API test',
            'start_time' => $start->toIso8601String(),
            'end_time' => $end->toIso8601String(),
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$participant->id],
        ])->assertCreated();

        Sanctum::actingAs($participant);

        $this->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonPath('unread_count', 1)
            ->assertJsonPath('data.0.title', 'Notification API test');

        $notificationId = $participant->notifications()->first()->id;

        $this->patchJson("/api/v1/notifications/{$notificationId}/read")
            ->assertOk()
            ->assertJsonPath('data.read_at', fn ($value) => $value !== null);

        $this->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonPath('unread_count', 0);

        $this->postJson('/api/v1/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('unread_count', 0);
    }
}
