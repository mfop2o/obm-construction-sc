<?php

namespace Tests\Feature\Api;

use App\Models\AboutSetting;
use App\Models\AboutValue;
use App\Models\CareerBenefit;
use App\Models\CareerValue;
use App\Models\Contact;
use App\Models\ContactSetting;
use App\Models\HomeStat;
use App\Models\Milestone;
use App\Models\Office;
use App\Models\Opening;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentControllerTest extends TestCase
{
    use RefreshDatabase;

    /* ---- Public reads ---- */

    public function test_guests_can_list_testimonials(): void
    {
        $first = Testimonial::factory()->create(['name' => 'Alpha Client', 'sort_order' => 1]);
        $second = Testimonial::factory()->create(['name' => 'Beta Client', 'sort_order' => 2]);

        $response = $this->getJson('/api/testimonials');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', $first->name)
            ->assertJsonPath('data.1.name', $second->name);
    }

    public function test_guests_can_read_contact_settings_and_offices(): void
    {
        $settings = ContactSetting::factory()->create();
        $office = Office::factory()->create();

        $this->getJson('/api/contact-settings')
            ->assertOk()
            ->assertJsonPath('data.settings.id', $settings->id)
            ->assertJsonPath('data.offices.0.id', $office->id);
    }

    public function test_guests_can_list_services(): void
    {
        Service::factory()->create(['title' => 'Building Works']);

        $this->getJson('/api/services')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Building Works');
    }

    public function test_guests_can_read_careers_content(): void
    {
        $opening = Opening::factory()->create();
        $value = CareerValue::factory()->create();
        $benefit = CareerBenefit::factory()->create();

        $this->getJson('/api/careers')
            ->assertOk()
            ->assertJsonPath('data.openings.0.id', $opening->id)
            ->assertJsonPath('data.values.0.id', $value->id)
            ->assertJsonPath('data.benefits.0.id', $benefit->id);
    }

    public function test_guests_can_list_home_stats(): void
    {
        HomeStat::factory()->create(['label' => 'Years', 'value' => 15]);

        $this->getJson('/api/home-stats')
            ->assertOk()
            ->assertJsonPath('data.0.label', 'Years');
    }

    public function test_guests_can_read_about_content(): void
    {
        $settings = AboutSetting::factory()->create();
        $value = AboutValue::factory()->create();
        $milestone = Milestone::factory()->create();

        $this->getJson('/api/about')
            ->assertOk()
            ->assertJsonPath('data.settings.id', $settings->id)
            ->assertJsonPath('data.values.0.id', $value->id)
            ->assertJsonPath('data.milestones.0.id', $milestone->id);
    }

    /* ---- Contact form (public store) ---- */

    public function test_valid_payload_creates_contact_submission(): void
    {
        $response = $this->postJson('/api/contacts', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+251 911 000 000',
            'project_type' => 'Commercial Building',
            'message' => 'We would like a quote for a mixed-use development.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Jane Doe')
            ->assertJsonPath('data.read', false);

        $this->assertDatabaseHas('contacts', ['email' => 'jane@example.com']);
    }

    public function test_contact_form_requires_name_email_and_message(): void
    {
        $this->postJson('/api/contacts', [])
            ->assertUnprocessable()
            ->assertInvalid(['name', 'email', 'message']);
    }

    /* ---- Testimonial admin CRUD ---- */

    public function test_returns_401_when_managing_content_without_authentication(): void
    {
        $this->postJson('/api/testimonials', ['quote' => 'Great', 'name' => 'Client'])->assertUnauthorized();
    }

    public function test_valid_payload_creates_a_testimonial(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/testimonials', [
            'quote' => 'Delivered ahead of schedule.',
            'name' => 'Happy Client',
            'company' => 'Acme Corp',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Happy Client');
    }

    public function test_method_updates_a_testimonial(): void
    {
        $user = User::factory()->create();
        $testimonial = Testimonial::factory()->create();

        $response = $this->actingAs($user)->putJson("/api/testimonials/{$testimonial->id}", [
            'name' => 'Renamed Client',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Renamed Client');
    }

    public function test_method_deletes_a_testimonial(): void
    {
        $user = User::factory()->create();
        $testimonial = Testimonial::factory()->create();

        $this->actingAs($user)->deleteJson("/api/testimonials/{$testimonial->id}")->assertNoContent();

        $this->assertModelMissing($testimonial);
    }

    /* ---- Contact settings + offices admin ---- */

    public function test_admin_updates_contact_settings(): void
    {
        $user = User::factory()->create();
        ContactSetting::factory()->create();

        $response = $this->actingAs($user)->putJson('/api/contact-settings', [
            'phone' => '+251 11 222 3333',
            'email' => 'new@obmconstruction.com',
            'address_line_1' => 'Bole Road',
            'address_line_2' => 'Ethiopia',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.phone', '+251 11 222 3333');
    }

    public function test_admin_creates_and_deletes_an_office(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/offices', [
            'name' => 'Hawassa Office',
            'city' => 'Hawassa, Ethiopia',
        ]);

        $created->assertCreated()->assertJsonPath('data.name', 'Hawassa Office');

        $office = Office::firstOrFail();
        $this->actingAs($user)->deleteJson("/api/offices/{$office->id}")->assertNoContent();

        $this->assertModelMissing($office);
    }

    /* ---- Services admin CRUD ---- */

    public function test_admin_creates_updates_and_deletes_a_service(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/services', [
            'title' => 'New Service',
            'description' => 'A new capability.',
            'overview' => 'Full description of the new capability.',
            'capabilities' => ['Cap A', 'Cap B'],
        ]);
        $created->assertCreated();
        $service = Service::firstOrFail();

        $this->actingAs($user)->putJson("/api/services/{$service->id}", [
            'title' => 'Renamed Service',
        ])->assertOk()->assertJsonPath('data.title', 'Renamed Service');

        $this->actingAs($user)->deleteJson("/api/services/{$service->id}")->assertNoContent();
        $this->assertModelMissing($service);
    }

    public function test_service_requires_title_description_and_overview(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/services', [])
            ->assertUnprocessable()
            ->assertInvalid(['title', 'description', 'overview']);
    }

    /* ---- Careers admin CRUD ---- */

    public function test_admin_creates_and_deletes_an_opening(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/careers/openings', [
            'title' => 'Civil Engineer',
            'department' => 'Engineering',
            'blurb' => 'Join the engineering team.',
        ]);
        $created->assertCreated();
        $opening = Opening::firstOrFail();

        $this->actingAs($user)->deleteJson("/api/careers/openings/{$opening->id}")->assertNoContent();
        $this->assertModelMissing($opening);
    }

    public function test_admin_creates_and_updates_a_career_value(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/careers/values', [
            'title' => 'Integrity',
            'text' => 'We are transparent in everything we do.',
        ]);
        $created->assertCreated();
        $value = CareerValue::firstOrFail();

        $this->actingAs($user)->putJson("/api/careers/values/{$value->id}", [
            'title' => 'Integrity First',
        ])->assertOk()->assertJsonPath('data.title', 'Integrity First');
    }

    public function test_admin_creates_a_career_benefit(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/careers/benefits', [
            'text' => 'Relocation assistance',
        ])->assertCreated()->assertJsonPath('data.text', 'Relocation assistance');
    }

    /* ---- Home stats admin CRUD ---- */

    public function test_admin_creates_updates_and_deletes_a_home_stat(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/home-stats', [
            'label' => 'Awards won',
            'value' => 20,
            'suffix' => '+',
        ]);
        $created->assertCreated();
        $stat = HomeStat::firstOrFail();

        $this->actingAs($user)->putJson("/api/home-stats/{$stat->id}", [
            'value' => 25,
        ])->assertOk()->assertJsonPath('data.value', 25);

        $this->actingAs($user)->deleteJson("/api/home-stats/{$stat->id}")->assertNoContent();
        $this->assertModelMissing($stat);
    }

    public function test_home_stat_requires_a_numeric_value(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/home-stats', [
            'label' => 'Staff',
            'value' => 'many',
        ])->assertUnprocessable()->assertInvalid(['value']);
    }

    /* ---- About admin CRUD ---- */

    public function test_admin_updates_about_settings(): void
    {
        $user = User::factory()->create();
        AboutSetting::factory()->create();

        $this->actingAs($user)->putJson('/api/about', [
            'vision' => 'A new long-term vision for OBM.',
            'mission' => 'The updated mission statement.',
        ])->assertOk()->assertJsonPath('data.vision', 'A new long-term vision for OBM.');
    }

    public function test_admin_creates_and_deletes_an_about_value(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/about/values', [
            'title' => 'Sustainability',
            'description' => 'We build responsibly for the environment.',
        ]);
        $created->assertCreated();
        $value = AboutValue::firstOrFail();

        $this->actingAs($user)->deleteJson("/api/about/values/{$value->id}")->assertNoContent();
        $this->assertModelMissing($value);
    }

    public function test_admin_creates_and_updates_a_milestone(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/about/milestones', [
            'year' => '2025',
            'title' => 'New flagship project',
            'description' => 'A landmark delivery.',
        ]);
        $created->assertCreated();
        $milestone = Milestone::firstOrFail();

        $this->actingAs($user)->putJson("/api/about/milestones/{$milestone->id}", [
            'title' => 'Updated flagship project',
        ])->assertOk()->assertJsonPath('data.title', 'Updated flagship project');
    }

    /* ---- Contacts admin ---- */

    public function test_admin_lists_and_marks_contact_submissions_read(): void
    {
        $user = User::factory()->create();
        $contact = Contact::factory()->create(['read' => false]);

        $this->actingAs($user)->getJson('/api/contacts')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $response = $this->actingAs($user)->patchJson("/api/contacts/{$contact->id}/read", [
            'read' => true,
        ]);

        $response->assertOk()->assertJsonPath('data.read', true);
        $this->assertDatabaseHas('contacts', ['id' => $contact->id, 'read' => true]);
    }

    public function test_admin_list_can_filter_to_unread_only(): void
    {
        $user = User::factory()->create();
        Contact::factory()->create(['read' => true]);
        Contact::factory()->create(['read' => false]);

        $this->actingAs($user)->getJson('/api/contacts?unread=1')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_deletes_a_contact_submission(): void
    {
        $user = User::factory()->create();
        $contact = Contact::factory()->create();

        $this->actingAs($user)->deleteJson("/api/contacts/{$contact->id}")->assertNoContent();
        $this->assertModelMissing($contact);
    }
}