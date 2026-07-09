<?php

namespace Tests\Feature;

use App\Models\ConstraintRule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AcademicConstraintsTest extends TestCase
{
    use RefreshDatabase;

    public function test_exam_period_blocks_booking(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        ConstraintRule::query()->where('rule_type', 'exam_blackout')->update(['is_active' => false]);

        ConstraintRule::create([
            'name' => 'Test exam block',
            'rule_type' => 'exam_blackout',
            'is_active' => true,
            'valid_from' => '2026-08-10',
            'valid_to' => '2026-08-16',
        ]);

        $response = $this->postJson('/api/v1/meetings', [
            'title' => 'During exams',
            'start_time' => '2026-08-12T15:00:00+12:00',
            'end_time' => '2026-08-12T16:00:00+12:00',
            'meeting_mode' => 'jitsi',
        ]);

        $response->assertUnprocessable();
        $errors = $response->json('errors.clashes') ?? [];
        $this->assertTrue(collect($errors)->contains(fn ($c) => ($c['type'] ?? '') === 'policy'));
    }

    public function test_lecture_timetable_blocks_participant(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        ConstraintRule::query()->where('rule_type', 'exam_blackout')->update(['is_active' => false]);

        $response = $this->postJson('/api/v1/meetings', [
            'title' => 'During lecture',
            'start_time' => '2026-08-03T10:30:00+12:00',
            'end_time' => '2026-08-03T11:30:00+12:00',
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$lecturer->id],
        ]);

        $response->assertUnprocessable();
        $errors = $response->json('errors.clashes') ?? [];
        $this->assertTrue(collect($errors)->contains(fn ($c) => ($c['type'] ?? '') === 'timetable'));
    }

    public function test_free_slot_outside_lecture_and_exam_is_allowed(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        ConstraintRule::query()->where('rule_type', 'exam_blackout')->update(['is_active' => false]);

        $response = $this->postJson('/api/v1/meetings', [
            'title' => 'Free slot',
            'start_time' => '2026-08-07T15:00:00+12:00',
            'end_time' => '2026-08-07T16:00:00+12:00',
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$lecturer->id],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Free slot');
    }

    public function test_anyone_can_list_exam_periods(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $this->getJson('/api/v1/exam-periods')
            ->assertOk()
            ->assertJsonStructure(['data']);
    }
}
