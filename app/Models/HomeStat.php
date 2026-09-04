<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * HomeStat — a headline statistic shown in the homepage stats bar.
 */
#[Fillable(['translations', 'label', 'value', 'suffix', 'sort_order'])]
class HomeStat extends Model
{
    /** @use HasFactory<\Database\Factories\HomeStatFactory> */
    use HasFactory, Localizable;

    protected function casts(): array
    {
        return [
            'value' => 'integer',
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