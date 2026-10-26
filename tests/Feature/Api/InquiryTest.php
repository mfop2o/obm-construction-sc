<?php

use App\Models\Inquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

/**
 * Feature tests for the Request-a-Quote / project-inquiry workflow.
 * Public: a validated submission is persisted with an optional attachment
 * on the public diskholo. Admin: Sanctum-session-authenticated triage —
 * status, read flag, internal note + follow-up + attachment download/delete.
 */
class InquiryTest extends TestCase
{
    use RefreshDatabase;

    /** Public: a valid inquiry is accepted and returns only safe fields. */
    public function test_public_can_submit_an_inquiry(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'name' => 'Lemma Tadesse',
            'company' => 'Acme Group',
            'email' => 'lemma@example.com',
            'phone' => '+251911000000',
            'project_type' => 'Commercial',
            'project_location' => 'Addis Ababa',
            'budget_range' => '$250k–$1M',
            'start_timeline' => '3–6 months',
            'message' => 'We need a 3-storey commercial building.',
            'preferred_contact' => 'email',
            'consent' => true,
        ]);

        $response->assertCreated();
        $response->assertJsonStructure([
            'data' => ['id', 'name', 'email', 'created_at'],
        ]);
        $response->assertJsonMissingPath('data.status');

        $this->assertDatabaseHas('inquiries', [
            'email' => 'lemma@example.com',
            'status' => 'new',
            'read' => false,
        ]);
    }

    /** Public: consent is required (GDPR-style). */
    public function test_public_must_consent_before_submitting(): void
    {
        $this->postJson('/api/inquiries', [
            'name' => 'Aster Lemma',
            'email' => 'aster@example.com',
            'message' => 'Renovation of a family home.',
            'consent' => false,
        ])->assertStatus(422)
            ->assertJsonValidationErrors('consent');

        $this->assertDatabaseCount('inquiries', 0);
    }

    /** Public: an optional attachment is stored and referenced. */
    public function test_public_can_attach_a_file(): void
    {
        Storage::fake('public');

        $response = $this->postJson('/api/inquiries', [
            'name' => 'Mulu Kebede',
            'email' => 'mulu@example.com',
            'message' => 'Site plan attached.',
            'consent' => true,
            'attachment' => UploadedFile::fake()->image('site-plan.jpg', 800, 600),
        ]);

        $response->assertCreated();

        $inquiry = Inquiry::query()->firstOrFail();
        $this->assertNotNull($inquiry->attachment_path);
        Storage::disk('public')->assertExists($inquiry->attachment_path);
    }

    /** Admin: an unauthenticated visitor cannot read the inquiry list. */
    public function test_inquiries_require_authentication(): void
    {
        $this->getJson('/api/inquiries')->assertUnauthorized();
    }
}
