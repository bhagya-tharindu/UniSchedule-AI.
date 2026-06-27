<?php

namespace Database\Seeders;

use App\Models\Availability;
use App\Models\ConstraintRule;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
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

        ConstraintRule::create([
            'name' => 'Exam week blackout',
            'rule_type' => 'exam_blackout',
            'is_active' => false,
            'valid_from' => now()->addMonths(2)->toDateString(),
            'valid_to' => now()->addMonths(2)->addDays(7)->toDateString(),
        ]);
    }
}
