<?php

namespace Database\Factories;

use App\Models\Milestone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Milestone>
 */
class MilestoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'year' => (string) $this->faker->numberBetween(2000, 2026),
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'sort_order' => 0,
        ];
    }
}