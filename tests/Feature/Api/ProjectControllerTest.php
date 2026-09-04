<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_list_projects(): void
    {
        $alpha = Project::factory()->create(['title' => 'Alpha Market']);
        $beta = Project::factory()->create(['title' => 'Beta Roads']);

        $response = $this->getJson('/api/projects');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.title', $alpha->title)
            ->assertJsonPath('data.1.title', $beta->title);
    }

    public function test_guests_can_view_a_project_by_slug(): void
    {
        $project = Project::factory()->create(['title' => 'Gamma Works']);

        $response = $this->getJson("/api/projects/{$project->slug}");

        $response->assertOk()
            ->assertJsonPath('data.title', 'Gamma Works');
    }

    public function test_returns_404_for_unknown_project_slug(): void
    {
        $this->getJson('/api/projects/does-not-exist')->assertNotFound();
    }

    public function test_returns_401_when_creating_without_authentication(): void
    {
        $this->postJson('/api/projects', ['title' => 'Sneaky'])->assertUnauthorized();
    }

    public function test_valid_payload_creates_project_and_returns_201(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/projects', [
            'title' => 'Delta Tower',
            'category' => 'Commercial',
            'year' => '2024',
            'location' => 'Addis Ababa',
            'status' => 'Completed',
            'client' => 'OBM',
            'description' => 'A landmark tower.',
            'visual' => 'facade',
            'variant' => 1,
            'size' => 'standard',
            'featured' => false,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Delta Tower')
            ->assertJsonPath('data.slug', 'delta-tower');

        $this->assertDatabaseHas('projects', ['title' => 'Delta Tower']);
    }

    public function test_returns_422_with_message_when_title_is_missing(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/projects', []);

        $response->assertUnprocessable()
            ->assertInvalid(['title' => 'The title field is required.']);
    }

    public function test_derives_a_unique_slug_for_duplicate_titles(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->postJson('/api/projects', [
            'title' => 'Shared Name',
            'category' => 'Commercial',
        ])->assertCreated();

        $response = $this->actingAs($user)->postJson('/api/projects', [
            'title' => 'Shared Name',
            'category' => 'Commercial',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.slug', 'shared-name-2');
    }

    public function test_valid_payload_updates_project_and_returns_200(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->putJson("/api/projects/{$project->id}", [
            'title' => 'Renamed Project',
            'category' => 'Commercial',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'Renamed Project');

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'title' => 'Renamed Project']);
    }

    public function test_returns_204_when_deleting_a_project(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->deleteJson("/api/projects/{$project->id}");

        $response->assertNoContent();
        $this->assertModelMissing($project);
    }

    public function test_moves_a_project_up_in_the_ordering(): void
    {
        $user = User::factory()->create();
        $first = Project::factory()->create(['title' => 'First', 'sort_order' => 1]);
        $second = Project::factory()->create(['title' => 'Second', 'sort_order' => 2]);

        $response = $this->actingAs($user)->postJson("/api/projects/{$second->id}/reorder", [
            'direction' => 'up',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.0.id', $second->id);

        $this->assertDatabaseHas('projects', ['id' => $first->id, 'sort_order' => 2]);
        $this->assertDatabaseHas('projects', ['id' => $second->id, 'sort_order' => 1]);
    }

    public function test_returns_422_when_reorder_direction_is_invalid(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)->postJson("/api/projects/{$project->id}/reorder", [
            'direction' => 'sideways',
        ])->assertUnprocessable();
    }

    public function test_sets_a_single_project_as_featured(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create(['featured' => false]);
        $other = Project::factory()->create(['featured' => true]);

        $this->actingAs($user)->postJson("/api/projects/{$project->id}/featured")->assertOk();

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'featured' => true]);
        $this->assertDatabaseHas('projects', ['id' => $other->id, 'featured' => false]);
    }

    public function test_reset_restores_the_seed_projects(): void
    {
        $user = User::factory()->create();
        Project::factory()->create(['slug' => 'my-custom-project']);

        $response = $this->actingAs($user)->postJson('/api/projects/reset');

        $response->assertOk();
        $this->assertDatabaseMissing('projects', ['slug' => 'my-custom-project']);
        $this->assertDatabaseHas('projects', ['slug' => 'bati-regional-market']);
    }

    public function test_import_replaces_all_projects(): void
    {
        $user = User::factory()->create();
        Project::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/projects/import', [
            'projects' => [
                [
                    'slug' => 'from-backup',
                    'title' => 'Restored One',
                    'category' => 'Civic & Public',
                    'featured' => true,
                ],
                [
                    'title' => 'Restored Two',
                    'category' => 'Industrial',
                ],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonCount(2, 'data');

        $this->assertDatabaseCount('projects', 2);
        $this->assertDatabaseHas('projects', ['slug' => 'from-backup', 'title' => 'Restored One']);
        $this->assertDatabaseHas('projects', ['title' => 'Restored Two']);
    }
}
