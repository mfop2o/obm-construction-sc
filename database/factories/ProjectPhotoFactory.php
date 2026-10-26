<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectPhoto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectPhoto>
 */
class ProjectPhotoFactory extends Factory
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
            'path' => 'project-photos/'.$this->faker->uuid().'.jpg',
            'original_name' => $this->faker->word().'.jpg',
            'caption' => $this->faker->sentence(),
            'is_cover' => false,
            'sort_order' => 0,
        ];
    }

    /**
     * The project's cover photograph.
     */
    public function cover(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_cover' => true,
        ]);
    }
}
