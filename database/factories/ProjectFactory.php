<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(2),
            'title' => $this->faker->words(3, true),
            'category' => $this->faker->randomElement(['Commercial', 'Residential', 'Industrial', 'Institutional', 'Civic & Public', 'Mixed-Use']),
            'year' => $this->faker->numberBetween(2018, 2026),
            'location' => $this->faker->city(),
            'region' => $this->faker->randomElement(['Addis Ababa', 'Oromia', 'Amhara', 'Sidama', 'Other Regions']),
            'status' => $this->faker->randomElement(ProjectStatus::cases()),
            'client' => $this->faker->company(),
            'consultant' => $this->faker->company(),
            'contractor' => 'OBM Construction S.C.',
            'contract_amount' => $this->faker->randomFloat(2, 100000, 900000000),
            'currency' => 'ETB',
            'contract_date' => now()->subYears(2),
            'start_date' => now()->subYears(1),
            'completion_date' => now()->addMonths(6),
            'acceptance_date' => null,
            'physical_progress' => $this->faker->numberBetween(0, 100),
            'financial_progress' => $this->faker->numberBetween(0, 100),
            'description' => $this->faker->paragraph(),
            'overview' => $this->faker->paragraphs(2, true),
            'challenge' => $this->faker->paragraph(),
            'approach' => $this->faker->paragraphs(2, true),
            'result' => $this->faker->paragraph(),
            'visual' => $this->faker->randomElement(['facade', 'interior', 'aerial', 'detail']),
            'variant' => $this->faker->numberBetween(1, 4),
            'image' => null,
            'size' => $this->faker->randomElement(['standard', 'large', 'compact', 'full']),
            'featured' => false,
            'scope' => [[
                'key' => $this->faker->word(),
                'value' => $this->faker->word(),
            ]],
            'gallery' => [[
                'visual' => 'facade',
                'variant' => 1,
                'alt' => $this->faker->words(3, true),
            ]],
            'sort_order' => 0,
        ];
    }

    /**
     * A project whose site works are currently running.
     */
    public function ongoing(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ProjectStatus::Ongoing->value,
            'acceptance_date' => null,
        ]);
    }

    /**
     * A project whose construction has finished.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ProjectStatus::Completed->value,
        ]);
    }

    /**
     * A project that has been formally accepted by the client.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ProjectStatus::Accepted->value,
            'acceptance_date' => now()->subMonth(),
        ]);
    }

    /**
     * A project that has not started yet.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ProjectStatus::Upcoming->value,
            'start_date' => now()->addMonths(2),
        ]);
    }
}
