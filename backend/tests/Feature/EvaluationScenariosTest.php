<?php

namespace Tests\Feature;

use App\Models\Availability;
use App\Models\ConstraintRule;
use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\Room;
use App\Models\User;
use App\Services\ClashDetectionService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Evaluation scenarios EV-01 … EV-25 — see docs/research/evaluation-test-scenarios.md
 */
class EvaluationScenariosTest extends TestCase
{
    use RefreshDatabase;

    private ClashDetectionService $clash;

    protected function setUp(): void
    {
        parent::setUp();
        $this->clash = app(ClashDetectionService::class);
    }

    /** EV-01: Partial time overlap with existing participant meeting. */
    public function test_ev01_partial_participant_overlap(): void
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

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-02 10:30:00'),
            Carbon::parse('2026-06-02 11:30:00'),
            [$user->id],
            null,
        );

        $this->assertNotEmpty($clashes);
        $this->assertContains('participant', array_column($clashes, 'type'));
    }

    /** EV-02: Back-to-back meetings (no overlap) are allowed. */
    public function test_ev02_back_to_back_meetings_allowed(): void
    {
        $user = User::factory()->create();

        Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Morning',
            'start_time' => Carbon::parse('2026-06-02 09:00:00'),
            'end_time' => Carbon::parse('2026-06-02 10:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-02 10:00:00'),
            Carbon::parse('2026-06-02 11:00:00'),
            [$user->id],
            null,
        );

        $this->assertEmpty($clashes);
    }

    /** EV-03: Cancelled meetings do not block new bookings. */
    public function test_ev03_cancelled_meeting_does_not_block(): void
    {
        $user = User::factory()->create();

        Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Cancelled slot',
            'start_time' => Carbon::parse('2026-06-02 14:00:00'),
            'end_time' => Carbon::parse('2026-06-02 15:00:00'),
            'status' => 'cancelled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-02 14:00:00'),
            Carbon::parse('2026-06-02 15:00:00'),
            [$user->id],
            null,
        );

        $this->assertEmpty($clashes);
    }

    /** EV-04: Updating a meeting excludes itself from participant clash check. */
    public function test_ev04_update_excludes_self_from_clash(): void
    {
        $user = User::factory()->create();
        $room = Room::create(['name' => 'B1', 'capacity' => 10]);

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'room_id' => $room->id,
            'title' => 'Original',
            'start_time' => Carbon::parse('2026-06-02 10:00:00'),
            'end_time' => Carbon::parse('2026-06-02 11:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-02 10:00:00'),
            Carbon::parse('2026-06-02 11:00:00'),
            [$user->id],
            $room->id,
            $meeting->id,
        );

        $this->assertEmpty($clashes);
    }

    /** EV-05: Room double-booking is detected. */
    public function test_ev05_room_double_booking(): void
    {
        $organizer = User::factory()->create();
        $room = Room::create(['name' => 'C1', 'capacity' => 20]);

        Meeting::create([
            'organizer_id' => $organizer->id,
            'room_id' => $room->id,
            'title' => 'Room taken',
            'start_time' => Carbon::parse('2026-06-03 13:00:00'),
            'end_time' => Carbon::parse('2026-06-03 14:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-03 13:30:00'),
            Carbon::parse('2026-06-03 14:30:00'),
            [User::factory()->create()->id],
            $room->id,
        );

        $this->assertNotEmpty($clashes);
        $this->assertContains('room', array_column($clashes, 'type'));
    }

    /** EV-06: No room clash when room_id is null (online meeting). */
    public function test_ev06_no_room_clash_when_room_not_selected(): void
    {
        $organizer = User::factory()->create();
        $room = Room::create(['name' => 'D1', 'capacity' => 20]);

        Meeting::create([
            'organizer_id' => $organizer->id,
            'room_id' => $room->id,
            'title' => 'Physical booking',
            'start_time' => Carbon::parse('2026-06-04 10:00:00'),
            'end_time' => Carbon::parse('2026-06-04 11:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-04 10:00:00'),
            Carbon::parse('2026-06-04 11:00:00'),
            [User::factory()->create()->id],
            null,
        );

        $this->assertEmpty(array_filter($clashes, fn ($c) => $c['type'] === 'room'));
    }

    /** EV-07: End time before start time is rejected. */
    public function test_ev07_end_before_start(): void
    {
        $user = User::factory()->create();

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-05 15:00:00'),
            Carbon::parse('2026-06-05 14:00:00'),
            [$user->id],
            null,
        );

        $this->assertNotEmpty($clashes);
        $this->assertSame('time', $clashes[0]['type']);
    }

    /** EV-08: Participant attending another meeting (not organiser) is blocked. */
    public function test_ev08_participant_attendee_clash(): void
    {
        $organizer = User::factory()->create();
        $attendee = User::factory()->create();
        $room = Room::create(['name' => 'E1', 'capacity' => 10]);

        $existing = Meeting::create([
            'organizer_id' => $organizer->id,
            'room_id' => $room->id,
            'title' => 'Team sync',
            'start_time' => Carbon::parse('2026-06-06 11:00:00'),
            'end_time' => Carbon::parse('2026-06-06 12:00:00'),
            'status' => 'scheduled',
        ]);

        MeetingParticipant::create([
            'meeting_id' => $existing->id,
            'user_id' => $attendee->id,
            'response' => 'accepted',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-06 11:30:00'),
            Carbon::parse('2026-06-06 12:30:00'),
            [$attendee->id],
            null,
        );

        $this->assertContains('participant', array_column($clashes, 'type'));
    }

    /** EV-09: User with no availability records is not blocked by availability rules. */
    public function test_ev09_no_availability_records_means_no_availability_clash(): void
    {
        $user = User::factory()->create();

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-07 22:00:00'),
            Carbon::parse('2026-06-07 23:00:00'),
            [$user->id],
            null,
        );

        $this->assertEmpty(array_filter($clashes, fn ($c) => $c['type'] === 'availability'));
    }

    /** EV-10: Meeting outside declared availability hours is blocked. */
    public function test_ev10_outside_availability_window(): void
    {
        $user = User::factory()->create();

        Availability::create([
            'user_id' => $user->id,
            'day_of_week' => 1,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-01 18:00:00'),
            Carbon::parse('2026-06-01 19:00:00'),
            [$user->id],
            null,
        );

        $this->assertContains('availability', array_column($clashes, 'type'));
    }

    /** EV-11: Meeting within availability window passes availability check. */
    public function test_ev11_within_availability_window(): void
    {
        $user = User::factory()->create();

        Availability::create([
            'user_id' => $user->id,
            'day_of_week' => 2,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-02 10:00:00'),
            Carbon::parse('2026-06-02 11:00:00'),
            [$user->id],
            null,
        );

        $this->assertEmpty(array_filter($clashes, fn ($c) => $c['type'] === 'availability'));
    }

    /** EV-12: Multiple participants — only clashing user triggers participant clash. */
    public function test_ev12_multiple_participants_one_clashes(): void
    {
        $free = User::factory()->create(['name' => 'Free User']);
        $busy = User::factory()->create(['name' => 'Busy User']);

        Meeting::create([
            'organizer_id' => $busy->id,
            'title' => 'Busy meeting',
            'start_time' => Carbon::parse('2026-06-08 14:00:00'),
            'end_time' => Carbon::parse('2026-06-08 15:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-08 14:30:00'),
            Carbon::parse('2026-06-08 15:30:00'),
            [$free->id, $busy->id],
            null,
        );

        $participantClashes = array_filter($clashes, fn ($c) => $c['type'] === 'participant');
        $this->assertCount(1, $participantClashes);
        $this->assertStringContainsString('Busy User', $participantClashes[array_key_first($participantClashes)]['message']);
    }

    /** EV-13: Campus-wide exam blackout policy blocks booking. */
    public function test_ev13_campus_exam_blackout(): void
    {
        $user = User::factory()->create();

        ConstraintRule::create([
            'name' => 'Mid-semester exams',
            'rule_type' => 'exam_blackout',
            'is_active' => true,
            'valid_from' => '2026-06-09',
            'valid_to' => '2026-06-15',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-10 10:00:00'),
            Carbon::parse('2026-06-10 11:00:00'),
            [$user->id],
            null,
        );

        $this->assertContains('policy', array_column($clashes, 'type'));
    }

    /** EV-14: Timetable slot blocks participant during lecture hours. */
    public function test_ev14_timetable_clash(): void
    {
        $this->seed();
        ConstraintRule::query()->where('rule_type', 'exam_blackout')->update(['is_active' => false]);

        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();

        $clashes = $this->clash->detect(
            Carbon::parse('2026-08-03 10:30:00'),
            Carbon::parse('2026-08-03 11:30:00'),
            [$lecturer->id],
            null,
        );

        $this->assertContains('timetable', array_column($clashes, 'type'));
    }

    /** EV-15: Course exam period blocks enrolled participant. */
    public function test_ev15_course_exam_clash(): void
    {
        $this->seed();
        ConstraintRule::query()->where('rule_type', 'exam_blackout')->update(['is_active' => false]);

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();

        $clashes = $this->clash->detect(
            Carbon::parse('2026-09-03 15:00:00'),
            Carbon::parse('2026-09-03 16:00:00'),
            [$student->id],
            null,
        );

        $this->assertContains('exam', array_column($clashes, 'type'));
    }

    /** EV-16: User not enrolled in course is not blocked by that course's exams. */
    public function test_ev16_non_enrolled_user_not_blocked_by_course_exam(): void
    {
        $this->seed();
        ConstraintRule::query()->where('rule_type', 'exam_blackout')->update(['is_active' => false]);

        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();

        $clashes = $this->clash->detect(
            Carbon::parse('2026-09-18 15:00:00'),
            Carbon::parse('2026-09-18 16:00:00'),
            [$lecturer->id],
            null,
        );

        $this->assertEmpty(array_filter($clashes, fn ($c) => $c['type'] === 'exam'));
    }

    /** EV-17: Combined participant and room clashes are both reported. */
    public function test_ev17_combined_participant_and_room_clashes(): void
    {
        $user = User::factory()->create();
        $room = Room::create(['name' => 'F1', 'capacity' => 10]);

        Meeting::create([
            'organizer_id' => $user->id,
            'room_id' => $room->id,
            'title' => 'Existing',
            'start_time' => Carbon::parse('2026-06-11 09:00:00'),
            'end_time' => Carbon::parse('2026-06-11 10:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-11 09:30:00'),
            Carbon::parse('2026-06-11 10:30:00'),
            [$user->id],
            $room->id,
        );

        $types = array_column($clashes, 'type');
        $this->assertContains('participant', $types);
        $this->assertContains('room', $types);
    }

    /** EV-18: check-clash API honours exclude_meeting_id. */
    public function test_ev18_check_clash_api_excludes_meeting(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Mine',
            'start_time' => Carbon::parse('2026-06-12 10:00:00'),
            'end_time' => Carbon::parse('2026-06-12 11:00:00'),
            'status' => 'scheduled',
        ]);

        $this->postJson('/api/v1/meetings/check-clash', [
            'start_time' => '2026-06-12T10:00:00+12:00',
            'end_time' => '2026-06-12T11:00:00+12:00',
            'exclude_meeting_id' => $meeting->id,
        ])
            ->assertOk()
            ->assertJsonPath('has_clashes', false);
    }

    /** EV-19: Room capacity exceeded on create returns validation error. */
    public function test_ev19_room_capacity_exceeded(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $room = Room::create(['name' => 'Small', 'capacity' => 2]);
        $extra = User::factory()->count(3)->create();

        $this->postJson('/api/v1/meetings', [
            'title' => 'Too many people',
            'start_time' => '2026-06-13T10:00:00+12:00',
            'end_time' => '2026-06-13T11:00:00+12:00',
            'room_id' => $room->id,
            'participant_ids' => $extra->pluck('id')->all(),
            'meeting_mode' => 'jitsi',
            'force' => true,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['room_id']);
    }

    /** EV-20: Non-overlapping meetings on same day are allowed. */
    public function test_ev20_same_day_non_overlapping_allowed(): void
    {
        $user = User::factory()->create();

        Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Morning',
            'start_time' => Carbon::parse('2026-06-14 09:00:00'),
            'end_time' => Carbon::parse('2026-06-14 10:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-14 14:00:00'),
            Carbon::parse('2026-06-14 15:00:00'),
            [$user->id],
            null,
        );

        $this->assertEmpty($clashes);
    }

    /** EV-21: Participant clash when meeting fully contains existing slot. */
    public function test_ev21_meeting_fully_contains_existing_slot(): void
    {
        $user = User::factory()->create();

        Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Short meeting',
            'start_time' => Carbon::parse('2026-06-15 11:00:00'),
            'end_time' => Carbon::parse('2026-06-15 11:30:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-15 10:00:00'),
            Carbon::parse('2026-06-15 12:00:00'),
            [$user->id],
            null,
        );

        $this->assertContains('participant', array_column($clashes, 'type'));
    }

    /** EV-22: Not available on day with no availability slot for that weekday. */
    public function test_ev22_not_available_on_day_without_slot(): void
    {
        $user = User::factory()->create();

        Availability::create([
            'user_id' => $user->id,
            'day_of_week' => 1,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-02 10:00:00'),
            Carbon::parse('2026-06-02 11:00:00'),
            [$user->id],
            null,
        );

        $this->assertContains('availability', array_column($clashes, 'type'));
    }

    /** EV-23: Policy + participant clashes both returned. */
    public function test_ev23_policy_and_participant_clashes_combined(): void
    {
        $user = User::factory()->create();

        ConstraintRule::create([
            'name' => 'Exam week',
            'rule_type' => 'exam_blackout',
            'is_active' => true,
            'valid_from' => '2026-06-16',
            'valid_to' => '2026-06-20',
        ]);

        Meeting::create([
            'organizer_id' => $user->id,
            'title' => 'Existing',
            'start_time' => Carbon::parse('2026-06-17 10:00:00'),
            'end_time' => Carbon::parse('2026-06-17 11:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-17 10:30:00'),
            Carbon::parse('2026-06-17 11:30:00'),
            [$user->id],
            null,
        );

        $types = array_column($clashes, 'type');
        $this->assertContains('policy', $types);
        $this->assertContains('participant', $types);
    }

    /** EV-24: Room update excludes self from room clash. */
    public function test_ev24_room_update_excludes_self(): void
    {
        $user = User::factory()->create();
        $room = Room::create(['name' => 'G1', 'capacity' => 10]);

        $meeting = Meeting::create([
            'organizer_id' => $user->id,
            'room_id' => $room->id,
            'title' => 'Room booking',
            'start_time' => Carbon::parse('2026-06-18 13:00:00'),
            'end_time' => Carbon::parse('2026-06-18 14:00:00'),
            'status' => 'scheduled',
        ]);

        $clashes = $this->clash->detect(
            Carbon::parse('2026-06-18 13:00:00'),
            Carbon::parse('2026-06-18 14:00:00'),
            [$user->id],
            $room->id,
            $meeting->id,
        );

        $this->assertEmpty(array_filter($clashes, fn ($c) => $c['type'] === 'room'));
    }

    /** EV-25: Seeded free slot passes all academic constraints. */
    public function test_ev25_seeded_free_slot_allowed(): void
    {
        $this->seed();
        ConstraintRule::query()->where('rule_type', 'exam_blackout')->update(['is_active' => false]);

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $this->postJson('/api/v1/meetings', [
            'title' => 'EV-25 free slot',
            'start_time' => '2026-08-07T15:00:00+12:00',
            'end_time' => '2026-08-07T16:00:00+12:00',
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$lecturer->id],
        ])->assertCreated();
    }
}
