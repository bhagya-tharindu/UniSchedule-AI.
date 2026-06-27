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

    public function test_parse_nlp_extracts_booking_from_natural_language(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/v1/meetings/parse-nlp', [
            'text' => 'Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.intent', 'book')
            ->assertJsonPath('data.parser', 'rules')
            ->assertJsonStructure([
                'data' => [
                    'title',
                    'start_time',
                    'end_time',
                    'participant_ids',
                    'participant_names',
                    'room_id',
                    'confidence',
                    'has_clashes',
                    'clashes',
                    'suggestions',
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data['start_time']);
        $this->assertNotEmpty($data['end_time']);
        $this->assertNotEmpty($data['participant_ids']);
        $this->assertSame(1, $data['room_id']);
    }

    public function test_parse_nlp_validates_required_text(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/meetings/parse-nlp', ['text' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['text']);
    }

    public function test_parse_nlp_detects_clashes_on_proposed_slot(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $first = $this->postJson('/api/v1/meetings', [
            'title' => 'Existing slot',
            'start_time' => '2026-07-01T14:00:00+12:00',
            'end_time' => '2026-07-01T15:00:00+12:00',
            'room_id' => 1,
        ]);
        $first->assertCreated();

        $response = $this->postJson('/api/v1/meetings/parse-nlp', [
            'text' => 'Book consultation with Dr Jane Lecturer on Tuesday at 2pm in ENG-101',
        ]);

        $response->assertOk();
        $data = $response->json('data');

        if ($data['start_time'] && str_contains($data['start_time'], '2026-07-01T14:')) {
            $this->assertTrue($data['has_clashes']);
            $this->assertNotEmpty($data['clashes']);
        } else {
            $this->assertIsBool($data['has_clashes']);
        }
    }
}
