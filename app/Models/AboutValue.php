<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * AboutValue — a core value shown on the About page.
 */
#[Fillable(['translations', 'title', 'description', 'sort_order'])]
class AboutValue extends Model
{
    /** @use HasFactory<\Database\Factories\AboutValueFactory> */
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