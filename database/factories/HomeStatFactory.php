<?php

namespace Database\Factories;

use App\Models\HomeStat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HomeStat>
 */
class HomeStatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => $this->faker->words(3, true),
            'value' => $this->faker->numberBetween(10, 999),
            'suffix' => $this->faker->randomElement(['+', 'K+', '']),
            'sort_order' => 0,
        ];
    }
}