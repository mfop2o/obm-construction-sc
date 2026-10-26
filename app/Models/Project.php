<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use App\Traits\Localizable;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Project — the single source of truth for the "Work" section and the project
 * portal described in the Terms of Reference.
 *
 * `scope` and `gallery` are stored as JSON to mirror the original frontend data
 * shape; contractual facts, progress, photos, documents and history live in
 * real columns and relations so the CMS can maintain them without a developer.
 *
 * Public categories are derived from `status` — the administrator never moves a
 * project between categories by hand.
 */
#[Fillable([
    'translations',
    'slug',
    'title',
    'category',
    'year',
    'location',
    'region',
    'status',
    'client',
    'consultant',
    'contractor',
    'contract_amount',
    'currency',
    'contract_date',
    'start_date',
    'completion_date',
    'acceptance_date',
    'physical_progress',
    'financial_progress',
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

    /**
     * How many projects the "latest projects" category shows before the
     * remainder becomes "previous projects".
     */
    public const LATEST_WINDOW = 6;

    protected function casts(): array
    {
        return [
            'status' => ProjectStatus::class,
            'featured' => 'boolean',
            'scope' => 'array',
            'gallery' => 'array',
            'variant' => 'integer',
            'sort_order' => 'integer',
            'contract_amount' => 'decimal:2',
            'contract_date' => 'date',
            'start_date' => 'date',
            'completion_date' => 'date',
            'acceptance_date' => 'date',
            'physical_progress' => 'integer',
            'financial_progress' => 'integer',
        ];
    }

    /** The default public ordering is by sort_order then newest first. */
    protected static function booted(): void
    {
        static::addGlobalScope('order', function ($builder) {
            $builder->orderBy('sort_order')->orderBy('id');
        });
    }

    /* ---- Relations ---- */

    /** Uploaded project photography, cover first. */
    public function photos(): HasMany
    {
        return $this->hasMany(ProjectPhoto::class)
            ->orderByDesc('is_cover')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    /** Project history / milestone timeline, newest first. */
    public function histories(): HasMany
    {
        return $this->hasMany(ProjectHistory::class)
            ->orderByDesc('occurred_on')
            ->orderByDesc('id');
    }

    /** Publicly downloadable project documents. */
    public function documents(): HasMany
    {
        return $this->hasMany(ProjectDocument::class)
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    /* ---- Derived public categories ---- */

    /** Projects currently under construction. */
    public function scopeOngoing(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::Ongoing);
    }

    /** Projects whose construction has been completed. */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->whereIn('status', [
            ProjectStatus::Completed,
            ProjectStatus::Maintenance,
        ]);
    }

    /** Projects officially accepted by the client. */
    public function scopeAccepted(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::Accepted);
    }

    /** Projects that have not started yet. */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('status', ProjectStatus::Upcoming);
    }

    /**
     * Recently added or recently updated projects — the "latest projects"
     * category. Ordering is applied last so it overrides the global ordering.
     */
    public function scopeLatest(Builder $query, ?int $limit = null): Builder
    {
        return $query->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->when($limit, fn (Builder $q) => $q->limit($limit));
    }

    /** Everything outside the "latest projects" window. */
    public function scopePrevious(Builder $query): Builder
    {
        return $query
            ->reorder()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->skip(self::LATEST_WINDOW)
            ->take(-1);
    }

    /* ---- Presentation helpers ---- */

    /** Whether the project has been handed over and accepted. */
    public function isAccepted(): bool
    {
        return $this->status?->isAccepted() ?? false;
    }

    /**
     * The cover photo. The photo explicitly flagged as the cover wins; otherwise
     * the first photo in the gallery ordering is used, so a project that has
     * never had its cover chosen still renders an image.
     */
    public function coverPhoto(): ?ProjectPhoto
    {
        return $this->photos->firstWhere('is_cover', true) ?? $this->photos->first();
    }

    /** True when the project has any uploaded photography. */
    public function hasPhotos(): bool
    {
        return $this->photos->isNotEmpty();
    }

    /** Publicly reachable URL of the project's cover photograph. */
    protected function coverPhotoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->coverPhoto()?->url);
    }

    /**
     * The principal image for the project, preferring uploaded photography over
     * the illustration registry. Serialised as `display_image`.
     */
    protected function displayImage(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->cover_photo_url ?? $this->image);
    }
}
