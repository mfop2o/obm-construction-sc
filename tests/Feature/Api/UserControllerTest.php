<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_list_users(): void
    {
        $this->getJson('/api/users')->assertUnauthorized();
    }

    public function test_managers_cannot_manage_user_accounts(): void
    {
        $manager = User::factory()->manager()->create();

        $this->actingAs($manager)->getJson('/api/users')->assertForbidden();
        $this->actingAs($manager)->postJson('/api/users', [
            'name' => 'Sneaky',
            'email' => 'sneaky@example.com',
            'password' => 'password',
        ])->assertForbidden();
    }

    public function test_admin_can_list_user_accounts(): void
    {
        $admin = User::factory()->create();
        User::factory()->count(2)->create();

        $this->actingAs($admin)->getJson('/api/users')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_a_user_account(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/users', [
            'name' => 'New Manager',
            'email' => 'manager@obm.local',
            'password' => 'secret-password',
            'role' => 'manager',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.email', 'manager@obm.local')
            ->assertJsonPath('data.role', 'manager');

        $this->assertDatabaseHas('users', ['email' => 'manager@obm.local', 'role' => 'manager']);
    }

    public function test_user_creation_requires_a_unique_email(): void
    {
        $admin = User::factory()->create();
        User::factory()->create(['email' => 'taken@example.com']);

        $this->actingAs($admin)->postJson('/api/users', [
            'name' => 'Duplicate',
            'email' => 'taken@example.com',
            'password' => 'secret-password',
        ])->assertUnprocessable()->assertInvalid(['email']);
    }

    public function test_admin_can_update_a_user_and_reset_password(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create(['role' => 'manager']);

        $this->actingAs($admin)->putJson("/api/users/{$user->id}", [
            'name' => 'Renamed',
            'password' => 'new-password',
        ])->assertOk()->assertJsonPath('data.name', 'Renamed');

        $this->assertTrue($user->fresh()->password !== '' && $user->fresh()->name === 'Renamed');
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)->deleteJson("/api/users/{$admin->id}")
            ->assertUnprocessable();
    }

    public function test_admin_can_delete_another_user(): void
    {
        $admin = User::factory()->create();
        $other = User::factory()->create();

        $this->actingAs($admin)->deleteJson("/api/users/{$other->id}")->assertNoContent();
        $this->assertModelMissing($other);
    }
}