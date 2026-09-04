<?php

namespace Database\Factories;

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
            'status' => $this->faker->randomElement(['Completed', 'Ongoing', 'Upcoming']),
            'client' => $this->faker->company(),
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
}
