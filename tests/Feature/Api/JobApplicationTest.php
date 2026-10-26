<?php

namespace Tests\Feature\Api;

use App\Enums\JobApplicationStatus;
use App\Models\JobApplication;
use App\Models\Opening;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Feature tests for the Phase 3 recruitment workflow: a candidate applies
 * online against an advertised vacancy, the system issues a reference, and the
 * HR dashboard triages the submission through its status workflow.
 */
class JobApplicationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A minimal valid public submission.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'position_applied_for' => 'Site Engineer',
            'full_name' => 'Lemma Tadesse',
            'phone' => '+251911000000',
            'email' => 'lemma@example.com',
            'consent' => true,
            'cv' => UploadedFile::fake()->create('cv.pdf', 64, 'application/pdf'),
        ], $overrides);
    }

    /* ---- Public application ---- */

    public function test_candidate_can_apply_and_receives_a_reference(): void
    {
        Storage::fake('public');

        $opening = Opening::factory()->create();

        $response = $this->postJson('/api/job-applications', $this->payload([
            'opening_id' => $opening->id,
        ]));

        $response->assertCreated()
            ->assertJsonStructure(['data' => ['application_number', 'position_applied_for', 'applied_at']]);

        $reference = $response->json('data.application_number');
        $this->assertMatchesRegularExpression(
            '/^OBM-'.now()->format('Y').'-\d{5}$/',
            $reference,
        );

        $this->assertDatabaseHas('job_applications', [
            'application_number' => $reference,
            'opening_id' => $opening->id,
            'status' => JobApplicationStatus::New->value,
        ]);
    }

    public function test_reference_numbers_increment_across_submissions(): void
    {
        Storage::fake('public');

        $first = $this->postJson('/api/job-applications', $this->payload())->json('data.application_number');
        $second = $this->postJson('/api/job-applications', $this->payload())->json('data.application_number');

        $this->assertNotSame($first, $second);
    }

    public function test_public_response_does_not_expose_internal_fields(): void
    {
        Storage::fake('public');

        $response = $this->postJson('/api/job-applications', $this->payload());

        $response->assertJsonMissingPath('data.admin_note');
        $response->assertJsonMissingPath('data.cv_path');
        $response->assertJsonMissingPath('data.email');
    }

    public function test_application_requires_a_cv_and_consent(): void
    {
        $this->postJson('/api/job-applications', [
            'position_applied_for' => 'Site Engineer',
            'full_name' => 'No Attachments',
            'phone' => '+251911000000',
            'email' => 'no@example.com',
            'consent' => false,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['consent', 'cv']);

        $this->assertDatabaseCount('job_applications', 0);
    }

    public function test_rejects_a_cv_that_is_not_an_allowed_file_type(): void
    {
        $this->postJson('/api/job-applications', $this->payload([
            'cv' => UploadedFile::fake()->image('cv.jpg'),
        ]))->assertUnprocessable()->assertJsonValidationErrors('cv');
    }

    public function test_cannot_apply_to_a_vacancy_past_its_deadline(): void
    {
        $opening = Opening::factory()->closed()->create();

        $this->postJson('/api/job-applications', $this->payload(['opening_id' => $opening->id]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('opening_id');

        $this->assertDatabaseCount('job_applications', 0);
    }

    public function test_certificates_are_optional_and_stored_when_supplied(): void
    {
        Storage::fake('public');

        $response = $this->postJson('/api/job-applications', $this->payload([
            'certificates' => UploadedFile::fake()->create('certificates.pdf', 32, 'application/pdf'),
        ]));

        $response->assertCreated();

        $application = JobApplication::query()->firstOrFail();
        $this->assertNotNull($application->certificates_path);
        Storage::disk('public')->assertExists($application->cv_path);
        Storage::disk('public')->assertExists($application->certificates_path);
    }

    /* ---- Public vacancy reads ---- */

    public function test_guests_only_see_active_vacancies_in_the_list(): void
    {
        Opening::factory()->create(['title' => 'Advertised Role']);
        Opening::factory()->retired()->create(['title' => 'Retired Role']);

        $this->getJson('/api/careers')
            ->assertOk()
            ->assertJsonCount(1, 'data.openings')
            ->assertJsonPath('data.openings.0.title', 'Advertised Role');
    }

    public function test_vacancy_detail_reports_whether_applications_are_open(): void
    {
        $open = Opening::factory()->create(['title' => 'Open Role']);
        $closed = Opening::factory()->closed()->create(['title' => 'Closed Role']);

        $this->getJson("/api/careers/{$open->id}")
            ->assertOk()
            ->assertJsonPath('data.is_accepting_applications', true);

        $this->getJson("/api/careers/{$closed->id}")
            ->assertOk()
            ->assertJsonPath('data.is_accepting_applications', false);
    }

    public function test_admin_stores_a_vacancy_with_its_advertisement_details(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/careers/openings', [
            'title' => 'Civil Engineer',
            'department' => 'Engineering',
            'location' => 'Addis Ababa',
            'type' => 'Full-time',
            'qualification' => 'BSc in Civil Engineering',
            'responsibilities' => 'Site supervision',
            'experience_years' => 5,
            'deadline' => now()->addMonth()->toDateString(),
        ])->assertCreated()
            ->assertJsonPath('data.qualification', 'BSc in Civil Engineering');

        $this->assertDatabaseHas('openings', ['title' => 'Civil Engineer', 'experience_years' => 5]);
    }

    public function test_rejects_a_vacancy_deadline_in_the_past(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/careers/openings', [
            'title' => 'Expired Advert',
            'deadline' => now()->subDay()->toDateString(),
        ])->assertUnprocessable()->assertJsonValidationErrors('deadline');
    }

    /* ---- HR dashboard ---- */

    public function test_application_list_requires_authentication(): void
    {
        $this->getJson('/api/job-applications')->assertUnauthorized();
    }

    public function test_admin_lists_and_searches_applications(): void
    {
        $user = User::factory()->create();
        JobApplication::factory()->withStatus(JobApplicationStatus::New)->create(['full_name' => 'Lemma Tadesse']);
        JobApplication::factory()->withStatus(JobApplicationStatus::Shortlisted)->create(['full_name' => 'Mulu Kebede']);

        $this->actingAs($user)->getJson('/api/job-applications')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAs($user)->getJson('/api/job-applications?status='.JobApplicationStatus::Shortlisted->value)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.full_name', 'Mulu Kebede');

        $this->actingAs($user)->getJson('/api/job-applications?search=Lemma')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.full_name', 'Lemma Tadesse');
    }

    public function test_dashboard_summary_counts_each_status(): void
    {
        $user = User::factory()->create();
        JobApplication::factory()->count(2)->withStatus(JobApplicationStatus::New)->create();
        JobApplication::factory()->withStatus(JobApplicationStatus::Interview)->create();

        $this->actingAs($user)->getJson('/api/job-applications/summary')
            ->assertOk()
            ->assertJsonPath('data.total', 3)
            ->assertJsonPath('data.by_status.new', 2)
            ->assertJsonPath('data.by_status.interview', 1);
    }

    public function test_admin_moves_an_application_through_the_triage_workflow(): void
    {
        $user = User::factory()->create();
        $application = JobApplication::factory()->create();

        $this->actingAs($user)->patchJson("/api/job-applications/{$application->id}/status", [
            'status' => JobApplicationStatus::Interview->value,
        ])->assertOk()->assertJsonPath('data.status', JobApplicationStatus::Interview->value);

        $this->assertDatabaseHas('job_applications', [
            'id' => $application->id,
            'status' => JobApplicationStatus::Interview->value,
        ]);
    }

    public function test_rejects_an_unknown_application_status(): void
    {
        $user = User::factory()->create();
        $application = JobApplication::factory()->create();

        $this->actingAs($user)->patchJson("/api/job-applications/{$application->id}/status", [
            'status' => 'imaginary',
        ])->assertUnprocessable()->assertJsonValidationErrors('status');
    }

    public function test_admin_records_an_internal_note(): void
    {
        $user = User::factory()->create();
        $application = JobApplication::factory()->create();

        $this->actingAs($user)->putJson("/api/job-applications/{$application->id}/note", [
            'admin_note' => 'Strong site experience; call for interview.',
        ])->assertOk();

        $this->assertDatabaseHas('job_applications', [
            'id' => $application->id,
            'admin_note' => 'Strong site experience; call for interview.',
        ]);
    }

    public function test_admin_can_download_the_cv_and_certificates(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $application = JobApplication::factory()->create([
            'cv_path' => 'job-applications/cv/lemma.pdf',
            'cv_name' => 'lemma-cv.pdf',
            'cv_mime' => 'application/pdf',
            'certificates_path' => 'job-applications/certificates/lemma.pdf',
            'certificates_name' => 'lemma-certificates.pdf',
            'certificates_mime' => 'application/pdf',
        ]);
        Storage::disk('public')->put('job-applications/cv/lemma.pdf', 'binary');
        Storage::disk('public')->put('job-applications/certificates/lemma.pdf', 'binary');

        $this->actingAs($user)->getJson("/api/job-applications/{$application->id}/attachment?kind=cv")
            ->assertOk()
            ->assertDownload('lemma-cv.pdf');

        $this->actingAs($user)->getJson("/api/job-applications/{$application->id}/attachment?kind=certificates")
            ->assertOk()
            ->assertDownload('lemma-certificates.pdf');
    }

    public function test_rejects_an_unknown_attachment_kind(): void
    {
        $user = User::factory()->create();
        $application = JobApplication::factory()->create();

        $this->actingAs($user)
            ->getJson("/api/job-applications/{$application->id}/attachment?kind=passport")
            ->assertUnprocessable();
    }

    public function test_deleting_an_application_removes_its_attachments(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $application = JobApplication::factory()->create([
            'cv_path' => 'job-applications/cv/doomed.pdf',
        ]);
        Storage::disk('public')->put('job-applications/cv/doomed.pdf', 'binary');

        $this->actingAs($user)->deleteJson("/api/job-applications/{$application->id}")->assertNoContent();

        Storage::disk('public')->assertMissing('job-applications/cv/doomed.pdf');
        $this->assertDatabaseMissing('job_applications', ['id' => $application->id]);
    }
}
