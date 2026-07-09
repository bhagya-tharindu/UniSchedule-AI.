<?php

namespace Database\Seeders;

use App\Models\Availability;
use App\Models\ConstraintRule;
use App\Models\Course;
use App\Models\CourseExamPeriod;
use App\Models\Room;
use App\Models\TimetableSlot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'System Admin',
            'email' => 'admin@unischedule.test',
            'role' => User::ROLE_ADMIN,
        ]);

        $lecturer = User::factory()->create([
            'name' => 'Dr Jane Lecturer',
            'email' => 'lecturer@unischedule.test',
            'role' => User::ROLE_LECTURER,
        ]);

        $student = User::factory()->create([
            'name' => 'Alex Student',
            'email' => 'student@unischedule.test',
            'role' => User::ROLE_STUDENT,
        ]);

        Room::create([
            'name' => 'ENG-101',
            'building' => 'Engineering',
            'capacity' => 30,
        ]);

        Room::create([
            'name' => 'SCI-202',
            'building' => 'Science',
            'capacity' => 20,
        ]);

        foreach ([$lecturer, $student] as $user) {
            // 0=Sunday … 6=Saturday — wide hours for local demo booking
            foreach (range(0, 6) as $day) {
                Availability::create([
                    'user_id' => $user->id,
                    'day_of_week' => $day,
                    'start_time' => '08:00:00',
                    'end_time' => '20:00:00',
                ]);
            }
        }

        // Optional campus-wide freeze (inactive by default — prefer course exams)
        ConstraintRule::create([
            'name' => 'Campus closed (example)',
            'rule_type' => 'exam_blackout',
            'is_active' => false,
            'valid_from' => '2026-12-24',
            'valid_to' => '2026-12-26',
        ]);

        $cosc = Course::create([
            'code' => 'COSC261',
            'name' => 'Introduction to Computer Science',
            'is_active' => true,
        ]);

        $info = Course::create([
            'code' => 'INFO213',
            'name' => 'Information Systems',
            'is_active' => true,
        ]);

        $cosc->users()->attach([$lecturer->id, $student->id]);
        $info->users()->attach([$student->id]);

        // Different exam windows per course
        CourseExamPeriod::create([
            'course_id' => $cosc->id,
            'name' => 'COSC261 end-of-semester exams',
            'valid_from' => '2026-09-01',
            'valid_to' => '2026-09-07',
            'is_active' => true,
        ]);

        CourseExamPeriod::create([
            'course_id' => $info->id,
            'name' => 'INFO213 end-of-semester exams',
            'valid_from' => '2026-09-15',
            'valid_to' => '2026-09-21',
            'is_active' => true,
        ]);

        $semesterFrom = Carbon::now(config('app.timezone'))->startOfYear()->toDateString();
        $semesterTo = Carbon::now(config('app.timezone'))->endOfYear()->toDateString();

        // Lecturer teaching slots (Mon=1, Wed=3)
        TimetableSlot::create([
            'user_id' => $lecturer->id,
            'day_of_week' => 1,
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'title' => 'COSC261 Lecture',
            'valid_from' => $semesterFrom,
            'valid_to' => $semesterTo,
            'is_active' => true,
        ]);

        TimetableSlot::create([
            'user_id' => $lecturer->id,
            'day_of_week' => 3,
            'start_time' => '14:00:00',
            'end_time' => '16:00:00',
            'title' => 'Office teaching',
            'valid_from' => $semesterFrom,
            'valid_to' => $semesterTo,
            'is_active' => true,
        ]);

        // Student class slots (Tue=2, Thu=4)
        TimetableSlot::create([
            'user_id' => $student->id,
            'day_of_week' => 2,
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'title' => 'COSC261 Lab',
            'valid_from' => $semesterFrom,
            'valid_to' => $semesterTo,
            'is_active' => true,
        ]);

        TimetableSlot::create([
            'user_id' => $student->id,
            'day_of_week' => 4,
            'start_time' => '11:00:00',
            'end_time' => '13:00:00',
            'title' => 'Tutorial',
            'valid_from' => $semesterFrom,
            'valid_to' => $semesterTo,
            'is_active' => true,
        ]);
    }
}
