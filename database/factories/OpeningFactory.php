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
            'sort_order' => 0,
        ];
    }
}