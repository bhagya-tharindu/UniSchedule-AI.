<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MeetingDeliveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_jitsi_meeting_with_auto_url(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        // Friday afternoon — outside seeded lectures and exam week demos
        $response = $this->postJson('/api/v1/meetings', [
            'title' => 'Supervision',
            'start_time' => '2026-08-07T15:00:00+12:00',
            'end_time' => '2026-08-07T16:00:00+12:00',
            'meeting_mode' => 'jitsi',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.meeting_mode', 'jitsi')
            ->assertJsonPath('data.status', 'scheduled');

        $url = $response->json('data.meeting_url');
        $this->assertIsString($url);
        $this->assertStringContainsString('meet.jit.si', $url);
        $this->assertStringContainsString('UniSchedule-', $url);
    }

    public function test_creates_external_meeting_with_link(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/v1/meetings', [
            'title' => 'Zoom catch-up',
            'start_time' => '2026-08-14T15:00:00+12:00',
            'end_time' => '2026-08-14T16:00:00+12:00',
            'meeting_mode' => 'external',
            'meeting_url' => 'https://zoom.us/j/123456789',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.meeting_mode', 'external')
            ->assertJsonPath('data.meeting_url', 'https://zoom.us/j/123456789');
    }

    public function test_external_mode_requires_url(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $this->postJson('/api/v1/meetings', [
            'title' => 'Missing link',
            'start_time' => '2026-08-14T15:00:00+12:00',
            'end_time' => '2026-08-14T16:00:00+12:00',
            'meeting_mode' => 'external',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['meeting_url']);
    }
}
