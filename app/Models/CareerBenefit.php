<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * CareerBenefit — a benefit bullet shown on the Careers page.
 */
#[Fillable(['translations', 'text', 'sort_order'])]
class CareerBenefit extends Model
{
    /** @use HasFactory<\Database\Factories\CareerBenefitFactory> */
    use HasFactory, Localizable;

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope('order', function ($builder) {
            $builder->orderBy('sort_order')->orderBy('id');
        });
    }
}