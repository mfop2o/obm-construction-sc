<?php

namespace Database\Factories;

use App\Models\AboutValue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AboutValue>
 */
class AboutValueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->words(2, true),
            'description' => $this->faker->paragraph(),
            'sort_order' => 0,
        ];
    }
}