<?php

namespace Database\Factories;

use App\Models\Opening;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Opening>
 */
class OpeningFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->jobTitle(),
            'department' => $this->faker->word(),
            'location' => $this->faker->city().', Ethiopia',
            'type' => $this->faker->randomElement(['Full-time', 'Contract']),
            'blurb' => $this->faker->sentence(),
            'qualification' => $this->faker->sentence(),
            'responsibilities' => $this->faker->paragraph(),
            'experience_years' => $this->faker->numberBetween(1, 10),
            'deadline' => $this->faker->dateTimeBetween('+1 week', '+3 months'),
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    /**
     * A vacancy that is no longer advertised publicly.
     */
    public function retired(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_active' => false,
        ]);
    }

    /**
     * A vacancy whose application deadline has already passed.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'deadline' => now()->subWeek(),
        ]);
    }
}
