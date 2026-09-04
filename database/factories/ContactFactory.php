<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'project_type' => $this->faker->randomElement(['Commercial Building', 'Residential Building', 'Roads & Infrastructure', 'Other']),
            'message' => $this->faker->paragraphs(2, true),
            'read' => false,
        ];
    }
}