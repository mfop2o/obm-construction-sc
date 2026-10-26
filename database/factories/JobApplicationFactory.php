<?php

namespace Database\Factories;

use App\Enums\JobApplicationStatus;
use App\Models\JobApplication;
use App\Models\Opening;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobApplication>
 */
class JobApplicationFactory extends Factory
{
    /** Monotonic counter so generated application numbers stay unique. */
    protected static int $sequence = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_number' => sprintf('OBM-%d-%05d', now()->year, ++self::$sequence),
            'opening_id' => Opening::factory(),
            'full_name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'date_of_birth' => $this->faker->dateTimeBetween('-45 years', '-22 years'),
            'phone' => '+2519'.$this->faker->numerify('########'),
            'email' => $this->faker->unique()->safeEmail(),
            'address' => $this->faker->address(),
            'education' => $this->faker->sentence(),
            'work_experience' => $this->faker->paragraph(),
            'skills' => $this->faker->words(5, true),
            'position_applied_for' => $this->faker->jobTitle(),
            'years_of_experience' => $this->faker->numberBetween(0, 20),
            'cover_letter' => $this->faker->paragraph(),
            'cv_path' => 'job-applications/cv/'.$this->faker->uuid().'.pdf',
            'cv_name' => 'cv.pdf',
            'cv_mime' => 'application/pdf',
            'cv_size' => $this->faker->numberBetween(50_000, 2_000_000),
            'certificates_path' => null,
            'certificates_name' => null,
            'certificates_mime' => null,
            'certificates_size' => null,
            'status' => JobApplicationStatus::New,
            'admin_note' => null,
            'applied_at' => now(),
        ];
    }

    /**
     * An application that has moved to a specific triage status.
     */
    public function withStatus(JobApplicationStatus $status): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => $status,
        ]);
    }
}
