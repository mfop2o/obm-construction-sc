<?php

namespace Database\Factories;

use App\Models\ContactSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactSetting>
 */
class ContactSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'address_line_1' => $this->faker->streetAddress(),
            'address_line_2' => $this->faker->city(),
        ];
    }
}