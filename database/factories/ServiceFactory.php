<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
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
            'description' => $this->faker->sentence(),
            'overview' => $this->faker->paragraphs(2, true),
            'image' => $this->faker->randomElement(['facade', 'framework', 'road', 'crane']),
            'image_key' => $this->faker->word(),
            'capabilities' => $this->faker->words(4),
            'sort_order' => 0,
        ];
    }
}