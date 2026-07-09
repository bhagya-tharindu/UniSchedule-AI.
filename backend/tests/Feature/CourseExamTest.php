<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseExamPeriod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseExamTest extends TestCase
{
    use RefreshDatabase;

    public function test_enrolled_user_blocked_during_course_exam_period(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        // COSC261 exams 2026-09-01..07 — both student and lecturer enrolled
        $response = $this->postJson('/api/v1/meetings', [
            'title' => 'During COSC exams',
            'start_time' => '2026-09-03T15:00:00+12:00',
            'end_time' => '2026-09-03T16:00:00+12:00',
            'meeting_mode' => 'jitsi',
            'participant_ids' => [$lecturer->id],
        ]);

        $response->assertUnprocessable();
        $errors = $response->json('errors.clashes') ?? [];
        $this->assertTrue(collect($errors)->contains(fn ($c) => ($c['type'] ?? '') === 'exam'));
    }

    public function test_user_not_on_course_not_blocked_by_that_courses_exams(): void
    {
        $this->seed();

        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($lecturer);

        // INFO213 exams 2026-09-15..21 — lecturer is NOT enrolled in INFO213
        // Friday 15:00 avoids lecturer Wed teaching slot
        $response = $this->postJson('/api/v1/meetings', [
            'title' => 'Lecturer free during INFO exams',
            'start_time' => '2026-09-18T15:00:00+12:00',
            'end_time' => '2026-09-18T16:00:00+12:00',
            'meeting_mode' => 'jitsi',
        ]);

        $response->assertCreated();
    }

    public function test_student_blocked_by_info_exams_lecturer_is_not(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        // Student enrolled in INFO213 — blocked (Friday still in exam week)
        $this->postJson('/api/v1/meetings', [
            'title' => 'Student during INFO exams',
            'start_time' => '2026-09-18T15:00:00+12:00',
            'end_time' => '2026-09-18T16:00:00+12:00',
            'meeting_mode' => 'jitsi',
        ])->assertUnprocessable();
    }

    public function test_admin_can_manage_courses_and_enrolments(): void
    {
        $this->seed();

        $admin = User::where('email', 'admin@unischedule.test')->firstOrFail();
        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($admin);

        $created = $this->postJson('/api/v1/admin/courses', [
            'code' => 'DATA101',
            'name' => 'Data Literacy',
        ]);
        $created->assertCreated();
        $courseId = $created->json('data.id');

        $this->postJson("/api/v1/admin/courses/{$courseId}/users", [
            'user_id' => $student->id,
        ])->assertOk();

        $this->postJson("/api/v1/admin/courses/{$courseId}/exam-periods", [
            'name' => 'DATA101 finals',
            'valid_from' => '2026-10-01',
            'valid_to' => '2026-10-05',
        ])->assertCreated();

        $this->getJson("/api/v1/admin/courses/{$courseId}")
            ->assertOk()
            ->assertJsonFragment(['code' => 'DATA101'])
            ->assertJsonFragment(['name' => 'DATA101 finals']);
    }

    public function test_my_exams_lists_enrolled_course_periods(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $this->getJson('/api/v1/my-exams')
            ->assertOk()
            ->assertJsonFragment(['course_code' => 'COSC261'])
            ->assertJsonFragment(['course_code' => 'INFO213']);

        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($lecturer);

        $this->getJson('/api/v1/my-exams')
            ->assertOk()
            ->assertJsonFragment(['course_code' => 'COSC261'])
            ->assertJsonMissing(['course_code' => 'INFO213']);
    }
}
