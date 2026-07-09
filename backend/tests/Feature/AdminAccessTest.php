<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_register_is_disabled(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'New User',
            'email' => 'new@test.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'student',
        ])->assertNotFound();
    }

    public function test_admin_can_create_user(): void
    {
        $this->seed();

        $admin = User::where('email', 'admin@unischedule.test')->firstOrFail();
        Sanctum::actingAs($admin);

        $this->postJson('/api/v1/admin/users', [
            'name' => 'New Student',
            'email' => 'new.student@test.com',
            'password' => 'password',
            'role' => 'student',
        ])->assertCreated()
            ->assertJsonPath('data.email', 'new.student@test.com')
            ->assertJsonPath('data.role', 'student');
    }

    public function test_lecturer_cannot_access_admin_users(): void
    {
        $this->seed();

        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($lecturer);

        $this->getJson('/api/v1/admin/users')->assertForbidden();
        $this->postJson('/api/v1/admin/users', [
            'name' => 'X',
            'email' => 'x@test.com',
            'password' => 'password',
            'role' => 'student',
        ])->assertForbidden();
    }

    public function test_admin_can_create_exam_period(): void
    {
        $this->seed();

        $admin = User::where('email', 'admin@unischedule.test')->firstOrFail();
        Sanctum::actingAs($admin);

        $this->postJson('/api/v1/admin/exam-periods', [
            'name' => 'Admin exam block',
            'valid_from' => '2026-11-01',
            'valid_to' => '2026-11-07',
            'is_active' => true,
        ])->assertCreated()
            ->assertJsonPath('data.name', 'Admin exam block');
    }

    public function test_lecturer_cannot_create_exam_period(): void
    {
        $this->seed();

        $lecturer = User::where('email', 'lecturer@unischedule.test')->firstOrFail();
        Sanctum::actingAs($lecturer);

        $this->postJson('/api/v1/admin/exam-periods', [
            'name' => 'Not allowed',
            'valid_from' => '2026-11-01',
            'valid_to' => '2026-11-07',
        ])->assertForbidden();
    }

    public function test_admin_can_manage_timetable_for_any_user(): void
    {
        $this->seed();

        $admin = User::where('email', 'admin@unischedule.test')->firstOrFail();
        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($admin);

        $created = $this->postJson('/api/v1/admin/timetable-slots', [
            'user_id' => $student->id,
            'day_of_week' => 5,
            'start_time' => '09:00',
            'end_time' => '10:00',
            'title' => 'Friday seminar',
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.user_id', $student->id);

        $id = $created->json('data.id');

        $this->getJson('/api/v1/timetable-slots?user_id='.$student->id)
            ->assertOk()
            ->assertJsonFragment(['title' => 'Friday seminar']);

        $this->deleteJson("/api/v1/admin/timetable-slots/{$id}")
            ->assertOk();
    }

    public function test_student_cannot_create_timetable_slot(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $this->postJson('/api/v1/admin/timetable-slots', [
            'user_id' => $student->id,
            'day_of_week' => 5,
            'start_time' => '09:00',
            'end_time' => '10:00',
            'title' => 'Not allowed',
        ])->assertForbidden();
    }
}
