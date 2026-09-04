<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Service — a construction service offered by OBM, shown on the Services
 * page and homepage preview.
 */
#[Fillable(['translations', 'title', 'description', 'overview', 'image', 'image_key', 'capabilities', 'sort_order'])]
class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory, Localizable;

    protected function casts(): array
    {
        return [
            'capabilities' => 'array',
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