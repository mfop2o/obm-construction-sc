<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'company' => $this->faker->optional()->company(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->optional()->e164PhoneNumber(),
            'project_type' => $this->faker->optional()->randomElement(['Commercial', 'Residential', 'Infrastructure', 'Mixed-Use', 'Renovation']),
            'project_location' => $this->faker->optional()->city(),
            'budget_range' => $this->faker->optional()->randomElement(['< $250k', '$250k–$1M', '$1M–$5M', '$5M–$20M', '> $20M']),
            'start_timeline' => $this->faker->optional()->randomElement(['Immediately', '0–3 months', '3–6 months', '6–12 months', 'Flexible']),
            'message' => $this->faker->paragraph(),
            'preferred_contact' => $this->faker->randomElement(['email', 'phone']),
            'consent' => true,
            'status' => 'new',
            'read' => false,
        ];
    }
}
