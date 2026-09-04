<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Milestone — a company milestone on the About page timeline.
 */
#[Fillable(['translations', 'year', 'title', 'description', 'sort_order'])]
class Milestone extends Model
{
    /** @use HasFactory<\Database\Factories\MilestoneFactory> */
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