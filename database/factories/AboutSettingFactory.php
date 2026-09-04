<?php

namespace Database\Factories;

use App\Models\AboutSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AboutSetting>
 */
class AboutSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mission' => $this->faker->paragraph(),
            'vision' => $this->faker->paragraph(),
        ];
    }
}