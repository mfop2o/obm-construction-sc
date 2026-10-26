<?php

namespace App\Models;

use App\Traits\Localizable;
use Database\Factories\OpeningFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Opening — a job vacancy advertised on the Careers page.
 *
 * `qualification`, `experience_years` and `deadline` are the advertisement
 * details; `is_active` retires a vacancy from the public list without deleting
 * the applications already submitted against it.
 */
#[Fillable([
    'translations',
    'title',
    'department',
    'location',
    'type',
    'blurb',
    'qualification',
    'responsibilities',
    'experience_years',
    'deadline',
    'is_active',
    'sort_order',
])]
class Opening extends Model
{
    /** @use HasFactory<OpeningFactory> */
    use HasFactory, Localizable;

    protected function casts(): array
    {
        return [
            'experience_years' => 'integer',
            'is_active' => 'boolean',
            'deadline' => 'date',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope('order', function ($builder) {
            $builder->orderBy('sort_order')->orderBy('id');
        });
    }

    /** Applications submitted against this vacancy. */
    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    /** Vacancies that are still advertised. */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /** Whether the application deadline has passed. */
    public function isClosed(): bool
    {
        return $this->deadline !== null && $this->deadline->isPast();
    }

    /** Whether the vacancy is advertised and still open for applications. */
    public function acceptingApplications(): bool
    {
        return $this->is_active && ! $this->isClosed();
    }

    /** Whether the vacancy still accepts applications. Serialised as `is_accepting_applications`. */
    protected function isAcceptingApplications(): Attribute
    {
        return Attribute::get(fn (): bool => $this->acceptingApplications());
    }
}
