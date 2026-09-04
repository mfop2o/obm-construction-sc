<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Opening — a job opening shown on the Careers page.
 */
#[Fillable(['translations', 'title', 'department', 'location', 'type', 'blurb', 'sort_order'])]
class Opening extends Model
{
    /** @use HasFactory<\Database\Factories\OpeningFactory> */
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