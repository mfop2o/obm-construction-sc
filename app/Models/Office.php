<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Office — a company location shown on the Contact page.
 */
#[Fillable(['translations', 'name', 'address', 'city', 'phone', 'email', 'sort_order'])]
class Office extends Model
{
    /** @use HasFactory<\Database\Factories\OfficeFactory> */
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