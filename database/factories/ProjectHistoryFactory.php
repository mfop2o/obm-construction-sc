<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectHistory>
 */
class ProjectHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'occurred_on' => now()->subMonths($this->faker->numberBetween(1, 36)),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'sort_order' => 0,
        ];
    }
}
