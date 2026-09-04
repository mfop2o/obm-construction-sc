<?php

namespace Database\Factories;

use App\Models\CareerValue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CareerValue>
 */
class CareerValueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->words(3, true),
            'text' => $this->faker->paragraph(),
            'sort_order' => 0,
        ];
    }
}