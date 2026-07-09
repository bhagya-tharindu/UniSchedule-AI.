<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NlpParseMeetingTest extends TestCase
{
    use RefreshDatabase;

    public function test_parse_nlp_requires_authentication(): void
    {
        $this->postJson('/api/v1/meetings/parse-nlp', [
            'text' => 'Book a meeting tomorrow at 2pm',
        ])->assertUnauthorized();
    }

    public function test_parse_nlp_online_mode_ignores_campus_room(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/v1/meetings/parse-nlp', [
            'text' => 'Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101',
            'meeting_mode' => 'jitsi',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.intent', 'book')
            ->assertJsonPath('data.parser', 'rules')
            ->assertJsonPath('data.room_id', null)
            ->assertJsonPath('data.room_name', null);

        $data = $response->json('data');
        $this->assertNotEmpty($data['start_time']);
        $this->assertNotEmpty($data['end_time']);
        $this->assertNotEmpty($data['participant_ids']);
        $this->assertStringContainsStringIgnoringCase('jane', $data['participant_names'][0] ?? '');
    }

    public function test_parse_nlp_online_keyword_ignores_room(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/v1/meetings/parse-nlp', [
            'text' => 'Book a supervision with Dr Jane Lecturer next Tuesday at 2pm online',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.room_id', null)
            ->assertJsonPath('data.room_name', null);

        $this->assertNotEmpty($response->json('data.participant_ids'));
    }

    public function test_parse_nlp_validates_required_text(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/meetings/parse-nlp', ['text' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['text']);
    }

    public function test_parse_nlp_detects_participant_clashes_without_room(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $first = $this->postJson('/api/v1/meetings', [
            'title' => 'Existing slot',
            'start_time' => '2026-07-07T14:00:00+12:00',
            'end_time' => '2026-07-07T15:00:00+12:00',
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$lecturer->id],
            'force' => true,
        ]);
        $first->assertCreated();

        $response = $this->postJson('/api/v1/meetings/parse-nlp', [
            'text' => 'Book consultation with Dr Jane Lecturer on Tuesday at 2pm online',
            'meeting_mode' => 'jitsi',
        ]);

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNull($data['room_id']);
        $this->assertIsBool($data['has_clashes']);
    }
}
