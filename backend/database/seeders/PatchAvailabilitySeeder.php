<?php

namespace Database\Seeders;

use App\Models\Availability;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Run once after pulling availability fixes: php artisan db:seed --class=PatchAvailabilitySeeder
 */
class PatchAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        foreach (User::all() as $user) {
            foreach (range(0, 6) as $day) {
                Availability::updateOrCreate(
                    ['user_id' => $user->id, 'day_of_week' => $day],
                    ['start_time' => '08:00:00', 'end_time' => '20:00:00'],
                );
            }
        }
    }
}
