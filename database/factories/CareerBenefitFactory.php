<?php

namespace Database\Factories;

use App\Models\CareerBenefit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CareerBenefit>
 */
class CareerBenefitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'text' => $this->faker->sentence(),
            'sort_order' => 0,
        ];
    }
}