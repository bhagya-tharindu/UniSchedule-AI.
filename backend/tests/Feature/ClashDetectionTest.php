<?php

namespace Tests\Feature;

use App\Models\Availability;
use App\Models\Meeting;
use App\Models\Room;
use App\Models\User;
use App\Services\ClashDetectionService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClashDetectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_detects_overlapping_participant_meetings(): void
    {
        $user = User::factory()->create();
        $room = Room::create(['name' => 'A1', 'capacity' => 10]);

        Meeting::create([
            'organizer_id' => $user->id,
            'room_id' => $room->id,
            'title' => 'Existing',
            'start_time' => Carbon::parse('2026-06-02 10:00:00'),
            'end_time' => Carbon::parse('2026-06-02 11:00:00'),
            'status' => 'scheduled',
        ]);

        $service = app(ClashDetectionService::class);
        $clashes = $service->detect(
            Carbon::parse('2026-06-02 10:30:00'),
            Carbon::parse('2026-06-02 11:30:00'),
            [$user->id],
            $room->id,
        );

        $this->assertNotEmpty($clashes);
        $this->assertContains('participant', array_column($clashes, 'type'));
    }

    public function test_no_clash_when_times_do_not_overlap(): void
    {
        $user = User::factory()->create();

        Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Morning',
            'start_time' => Carbon::parse('2026-06-02 09:00:00'),
            'end_time' => Carbon::parse('2026-06-02 10:00:00'),
            'status' => 'scheduled',
        ]);

        $service = app(ClashDetectionService::class);
        $clashes = $service->detect(
            Carbon::parse('2026-06-02 14:00:00'),
            Carbon::parse('2026-06-02 15:00:00'),
            [$user->id],
            null,
        );

        $this->assertEmpty($clashes);
    }

    public function test_allows_meeting_within_availability_window(): void
    {
        $user = User::factory()->create();

        Availability::create([
            'user_id' => $user->id,
            'day_of_week' => 2,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
        ]);

        $service = app(ClashDetectionService::class);
        $clashes = $service->detect(
            Carbon::parse('2026-06-02 10:00:00'),
            Carbon::parse('2026-06-02 11:00:00'),
            [$user->id],
            null,
        );

        $this->assertEmpty($clashes);
    }

    public function test_detects_meeting_outside_availability_window(): void
    {
        $user = User::factory()->create();

        Availability::create([
            'user_id' => $user->id,
            'day_of_week' => 2,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
        ]);

        $service = app(ClashDetectionService::class);
        $clashes = $service->detect(
            Carbon::parse('2026-06-02 18:00:00'),
            Carbon::parse('2026-06-02 19:00:00'),
            [$user->id],
            null,
        );

        $this->assertNotEmpty($clashes);
        $this->assertSame('availability', $clashes[0]['type']);
    }
}
