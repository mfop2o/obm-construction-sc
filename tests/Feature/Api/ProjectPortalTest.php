<?php

namespace Tests\Feature\Api;

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\ProjectHistory;
use App\Models\ProjectPhoto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Feature tests for the Phase 2 project portal: search, filters, derived
 * categories, uploaded photography, the history timeline and project documents.
 */
class ProjectPortalTest extends TestCase
{
    use RefreshDatabase;

    /* ---- Public search and filters ---- */

    public function test_guests_can_search_projects_by_title_and_location(): void
    {
        // The region is pinned on both fixtures: search covers region too, so a
        // random region could otherwise make either search term ambiguous.
        Project::factory()->create([
            'title' => 'Bati Regional Market',
            'location' => 'Bati',
            'region' => 'Amhara',
        ]);
        Project::factory()->ongoing()->create([
            'title' => 'Yeka Residential Blocks',
            'location' => 'Addis Ababa',
            'region' => 'Addis Ababa',
        ]);

        $this->getJson('/api/projects?search=Bati')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Bati Regional Market');

        $this->getJson('/api/projects?search=Addis')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Yeka Residential Blocks');
    }

    public function test_guests_can_filter_projects_by_status_region_and_year(): void
    {
        Project::factory()->ongoing()->create([
            'title' => 'Filtered Ongoing',
            'region' => 'Amhara',
            'year' => '2024',
        ]);
        Project::factory()->completed()->create([
            'title' => 'Filtered Completed',
            'region' => 'Oromia',
            'year' => '2019',
        ]);

        $this->getJson('/api/projects?status='.ProjectStatus::Ongoing->value)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Filtered Ongoing');

        $this->getJson('/api/projects?region=Oromia')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Filtered Completed');

        $this->getJson('/api/projects?year=2024')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Filtered Ongoing');
    }

    public function test_rejects_an_unknown_status_or_group(): void
    {
        $this->getJson('/api/projects?status=Imaginary')->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->getJson('/api/projects?group=sideways')->assertUnprocessable()
            ->assertJsonValidationErrors('group');
    }

    public function test_derives_the_ongoing_group_from_the_project_status(): void
    {
        Project::factory()->ongoing()->create(['title' => 'Currently Building']);
        Project::factory()->completed()->create(['title' => 'Already Finished']);

        $this->getJson('/api/projects?group=ongoing')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Currently Building');
    }

    public function test_project_detail_exposes_the_portal_relations(): void
    {
        $project = Project::factory()->create();
        $project->photos()->create(ProjectPhoto::factory()->make([
            'project_id' => $project->id,
            'path' => 'front.jpg',
        ])->getAttributes());
        ProjectHistory::factory()->for($project)->create();

        $response = $this->getJson("/api/projects/{$project->slug}");

        $response->assertOk()
            ->assertJsonCount(1, 'data.photos')
            ->assertJsonCount(1, 'data.histories')
            ->assertJsonStructure([
                'data' => [
                    'title',
                    'status',
                    'region',
                    'contract_amount',
                    'physical_progress',
                    'financial_progress',
                    'acceptance_date',
                    'photos',
                    'histories',
                    'documents',
                    'display_image',
                ],
            ]);
    }

    /* ---- Project photography ---- */

    public function test_admin_uploads_photos_and_the_first_becomes_the_cover(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->postJson("/api/projects/{$project->id}/photos", [
            'photos' => [
                UploadedFile::fake()->image('front.jpg'),
                UploadedFile::fake()->image('rear.jpg'),
            ],
        ]);

        $response->assertCreated()->assertJsonCount(2, 'data');

        $cover = $project->photos()->where('is_cover', true)->first();
        $this->assertNotNull($cover);
        Storage::disk('public')->assertExists($cover->path);
        $this->assertDatabaseCount('project_photos', 2); // exactly one cover among them
    }

    public function test_uploading_photos_requires_authentication(): void
    {
        $project = Project::factory()->create();

        $this->postJson("/api/projects/{$project->id}/photos", [
            'photos' => [UploadedFile::fake()->image('front.jpg')],
        ])->assertUnauthorized();
    }

    public function test_rejects_a_photo_upload_that_is_not_an_image(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)->postJson("/api/projects/{$project->id}/photos", [
            'photos' => [UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf')],
        ])->assertUnprocessable()->assertJsonValidationErrors('photos.0');
    }

    public function test_promoting_a_photo_to_cover_demotes_the_previous_cover(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $project = Project::factory()->create();
        $cover = $project->photos()->create(['path' => 'a.jpg', 'is_cover' => true]);
        $other = $project->photos()->create(['path' => 'b.jpg', 'is_cover' => false]);

        $this->actingAs($user)
            ->postJson("/api/projects/{$project->id}/photos/{$other->id}/cover")
            ->assertOk()
            ->assertJsonPath('data.is_cover', true);

        $this->assertDatabaseHas('project_photos', ['id' => $cover->id, 'is_cover' => false]);
    }

    public function test_deleting_a_photo_removes_its_file_from_disk(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $project = Project::factory()->create();
        $photo = $project->photos()->create(['path' => 'doomed.jpg', 'is_cover' => true]);
        Storage::disk('public')->put('doomed.jpg', 'binary');

        $this->actingAs($user)
            ->deleteJson("/api/projects/{$project->id}/photos/{$photo->id}")
            ->assertNoContent();

        Storage::disk('public')->assertMissing('doomed.jpg');
        $this->assertDatabaseMissing('project_photos', ['id' => $photo->id]);
    }

    public function test_rejects_an_invalid_reorder_direction(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        $photo = $project->photos()->create(['path' => 'a.jpg']);

        $this->actingAs($user)->postJson("/api/projects/{$project->id}/photos/reorder", [
            'photo_id' => $photo->id,
            'direction' => 'sideways',
        ])->assertUnprocessable()->assertJsonValidationErrors('direction');
    }

    /* ---- History timeline ---- */

    public function test_admin_adds_a_history_entry(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->postJson("/api/projects/{$project->id}/histories", [
            'occurred_on' => '2026-08-31',
            'title' => 'Project officially accepted',
            'description' => 'Handed over to the client.',
        ]);

        $response->assertCreated()->assertJsonPath('data.title', 'Project officially accepted');
        $this->assertDatabaseHas('project_histories', ['project_id' => $project->id]);
    }

    public function test_rejects_a_history_entry_without_a_title_or_date(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)->postJson("/api/projects/{$project->id}/histories", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['occurred_on', 'title']);
    }

    public function test_deleting_a_history_entry(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        $history = ProjectHistory::factory()->for($project)->create();

        $this->actingAs($user)
            ->deleteJson("/api/projects/{$project->id}/histories/{$history->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('project_histories', ['id' => $history->id]);
    }

    /* ---- Documents ---- */

    public function test_admin_uploads_a_document_and_it_is_publicly_downloadable(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->postJson("/api/projects/{$project->id}/documents", [
            'document' => UploadedFile::fake()->create('contract.pdf', 64, 'application/pdf'),
            'title' => 'Signed Contract',
        ]);

        $response->assertCreated()->assertJsonPath('data.title', 'Signed Contract');

        $document = $project->documents()->firstOrFail();
        Storage::disk('public')->assertExists($document->path);

        $this->get("/api/projects/{$project->id}/documents/{$document->id}")
            ->assertOk()
            ->assertDownload('contract.pdf');
    }

    public function test_rejects_a_document_upload_that_is_not_an_allowed_file_type(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $this->actingAs($user)->postJson("/api/projects/{$project->id}/documents", [
            'document' => UploadedFile::fake()->image('scan.jpg'),
        ])->assertUnprocessable()->assertJsonValidationErrors('document');
    }

    public function test_returns_404_when_downloading_a_missing_document(): void
    {
        $project = Project::factory()->create();

        $this->get("/api/projects/{$project->id}/documents/9999")->assertNotFound();
    }

    public function test_deleting_a_document_removes_its_file_from_disk(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $project = Project::factory()->create();
        $document = $project->documents()->create(['path' => 'doomed.pdf', 'title' => 'Old']);
        Storage::disk('public')->put('doomed.pdf', 'binary');

        $this->actingAs($user)
            ->deleteJson("/api/projects/{$project->id}/documents/{$document->id}")
            ->assertNoContent();

        Storage::disk('public')->assertMissing('doomed.pdf');
        $this->assertDatabaseMissing('project_documents', ['id' => $document->id]);
    }

    /* ---- Contract facts ---- */

    public function test_admin_stores_the_contractual_facts_of_a_project(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/projects', [
            'title' => 'Contract Facts Tower',
            'category' => 'Commercial',
            'status' => ProjectStatus::Ongoing->value,
            'consultant' => 'Ethio Consulting',
            'contractor' => 'OBM Construction S.C.',
            'contract_amount' => '1250000.50',
            'currency' => 'ETB',
            'contract_date' => '2025-01-15',
            'start_date' => '2025-02-01',
            'completion_date' => '2026-08-30',
            'region' => 'Addis Ababa',
            'physical_progress' => 65,
            'financial_progress' => 58,
        ])->assertCreated();

        $this->assertDatabaseHas('projects', [
            'title' => 'Contract Facts Tower',
            'consultant' => 'Ethio Consulting',
            'physical_progress' => 65,
        ]);
    }

    public function test_rejects_an_unknown_project_status(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/projects', [
            'title' => 'Bad Status',
            'category' => 'Commercial',
            'status' => 'Imaginary',
        ])->assertUnprocessable()->assertJsonValidationErrors('status');
    }
}
