<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_other_users_and_rooms(): void
    {
        $this->seed();

        $student = User::where('email', 'student@unischedule.test')->firstOrFail();
        Sanctum::actingAs($student);

        $users = $this->getJson('/api/v1/users');
        $users->assertOk()
            ->assertJsonMissing(['email' => 'student@unischedule.test'])
            ->assertJsonFragment(['email' => 'lecturer@unischedule.test']);

        $rooms = $this->getJson('/api/v1/rooms');
        $rooms->assertOk()
            ->assertJsonFragment(['name' => 'ENG-101'])
            ->assertJsonFragment(['name' => 'SCI-202']);
    }

    public function test_catalog_requires_authentication(): void
    {
        $this->getJson('/api/v1/users')->assertUnauthorized();
        $this->getJson('/api/v1/rooms')->assertUnauthorized();
    }
}
