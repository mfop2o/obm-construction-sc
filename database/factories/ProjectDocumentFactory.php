<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectDocument>
 */
class ProjectDocumentFactory extends Factory
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
            'title' => $this->faker->words(3, true).' Report',
            'path' => 'project-documents/'.$this->faker->uuid().'.pdf',
            'original_name' => $this->faker->word().'.pdf',
            'file_size' => $this->faker->numberBetween(50_000, 5_000_000),
            'mime' => 'application/pdf',
            'sort_order' => 0,
        ];
    }
}
