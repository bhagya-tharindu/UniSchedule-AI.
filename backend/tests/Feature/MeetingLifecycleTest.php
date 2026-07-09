<?php

namespace Tests\Feature;

use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MeetingLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_organizer_can_cancel_meeting(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $start = Carbon::now()->addDays(2)->setTime(10, 0);
        $end = (clone $start)->addHour();

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'To cancel',
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'scheduled',
            'meeting_mode' => 'jitsi',
        ]);

        $this->deleteJson("/api/v1/meetings/{$meeting->id}")
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_non_organizer_cannot_cancel_meeting(): void
    {
        $organizer = User::factory()->create();
        $other = User::factory()->create();
        Sanctum::actingAs($other);

        $meeting = Meeting::create([
            'organizer_id' => $organizer->id,
            'title' => 'Protected',
            'start_time' => Carbon::parse('2026-07-01 10:00:00'),
            'end_time' => Carbon::parse('2026-07-01 11:00:00'),
            'status' => 'scheduled',
        ]);

        $this->deleteJson("/api/v1/meetings/{$meeting->id}")
            ->assertForbidden();
    }

    public function test_organizer_can_update_meeting(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $start = Carbon::now()->addDays(3)->setTime(10, 0);
        $end = (clone $start)->addHour();
        $updatedStart = Carbon::now()->addDays(3)->setTime(14, 0);
        $updatedEnd = (clone $updatedStart)->addHour();

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Original title',
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'scheduled',
            'meeting_mode' => 'jitsi',
        ]);

        $this->putJson("/api/v1/meetings/{$meeting->id}", [
            'title' => 'Updated title',
            'start_time' => $updatedStart->toIso8601String(),
            'end_time' => $updatedEnd->toIso8601String(),
            'meeting_mode' => 'jitsi',
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated title');
    }

    public function test_cancelled_meeting_cannot_be_updated(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Cancelled',
            'start_time' => Carbon::parse('2026-07-03 10:00:00'),
            'end_time' => Carbon::parse('2026-07-03 11:00:00'),
            'status' => 'cancelled',
        ]);

        $this->putJson("/api/v1/meetings/{$meeting->id}", [
            'title' => 'Should fail',
        ])->assertUnprocessable();
    }

    public function test_finished_meeting_cannot_be_updated(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Finished',
            'start_time' => Carbon::now()->subHours(2),
            'end_time' => Carbon::now()->subHour(),
            'status' => 'scheduled',
            'meeting_mode' => 'jitsi',
        ]);

        $this->putJson("/api/v1/meetings/{$meeting->id}", [
            'title' => 'Should not update',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['meeting']);
    }

    public function test_finished_meeting_cannot_be_cancelled(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Finished',
            'start_time' => Carbon::now()->subHours(2),
            'end_time' => Carbon::now()->subHour(),
            'status' => 'scheduled',
            'meeting_mode' => 'jitsi',
        ]);

        $this->deleteJson("/api/v1/meetings/{$meeting->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['meeting']);
    }

    public function test_cancelled_slot_allows_new_booking_at_same_time(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Old cancelled',
            'start_time' => Carbon::parse('2026-07-04 10:00:00'),
            'end_time' => Carbon::parse('2026-07-04 11:00:00'),
            'status' => 'cancelled',
            'meeting_mode' => 'jitsi',
        ]);

        $this->postJson('/api/v1/meetings', [
            'title' => 'Replacement booking',
            'start_time' => '2026-07-04T10:00:00+12:00',
            'end_time' => '2026-07-04T11:00:00+12:00',
            'meeting_mode' => 'jitsi',
            'force' => true,
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Replacement booking');
    }
}
