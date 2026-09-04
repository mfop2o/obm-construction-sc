<?php

namespace App\Models;
use App\Traits\Localizable;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Project — the single source of truth for the dynamic "Work" section.
 *
 * Every public /projects page and the admin content system read and write to
 * this table. `scope` and `gallery` are stored as JSON to mirror the original
 * frontend data shape.
 */
#[Fillable(['translations', 
    'slug',
    'title',
    'category',
    'year',
    'location',
    'status',
    'client',
    'description',
    'overview',
    'challenge',
    'approach',
    'result',
    'visual',
    'variant',
    'image',
    'size',
    'featured',
    'scope',
    'gallery',
    'sort_order',
])]
#[Hidden([])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory, Localizable;

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'scope' => 'array',
            'gallery' => 'array',
            'variant' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /** The default public ordering is by sort_order then newest first. */
    protected static function booted(): void
    {
        static::addGlobalScope('order', function ($builder) {
            $builder->orderBy('sort_order')->orderBy('id');
        });
    }
}
