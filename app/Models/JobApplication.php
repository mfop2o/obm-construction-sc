<?php

namespace App\Models;

use App\Enums\JobApplicationStatus;
use Database\Factories\JobApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * JobApplication — an online job application submitted through the careers site.
 *
 * Every submission receives a human reference in the form OBM-2026-00125, which
 * the applicant can quote in correspondence and HR can search for.
 *
 * Admin-only fields (`status`, `admin_note`, `full_name`, `email`, `phone`,
 * attachments) are never exposed through any public endpoint.
 */
#[Fillable([
    'application_number',
    'opening_id',
    'full_name',
    'gender',
    'date_of_birth',
    'phone',
    'email',
    'address',
    'education',
    'work_experience',
    'skills',
    'position_applied_for',
    'years_of_experience',
    'cover_letter',
    'cv_path',
    'cv_name',
    'cv_mime',
    'cv_size',
    'certificates_path',
    'certificates_name',
    'certificates_mime',
    'certificates_size',
    'status',
    'admin_note',
    'applied_at',
])]
#[Hidden(['admin_note'])]
class JobApplication extends Model
{
    /** @use HasFactory<JobApplicationFactory> */
    use HasFactory;

    /**
     * Generate the next application reference for a given year.
     *
     * The sequence restarts each calendar year, matching the OBM-2026-00125
     * format. A short retry loop guards against two concurrent submissions
     * picking the same number.
     */
    public static function nextNumber(?int $year = null): string
    {
        $year ??= (int) now()->format('Y');
        $prefix = sprintf('OBM-%d-', $year);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $last = static::query()
                ->where('application_number', 'like', $prefix.'%')
                ->orderByDesc('application_number')
                ->value('application_number');

            $next = $last === null
                ? 1
                : ((int) Str::afterLast($last, '-')) + 1;

            $candidate = $prefix.str_pad((string) $next, 5, '0', STR_PAD_LEFT);

            if (! static::query()->where('application_number', $candidate)->exists()) {
                return $candidate;
            }

            usleep(50_000);
        }

        // Fall back to a collision-proof reference rather than looping forever.
        return $prefix.str_pad((string) random_int(10000, 99999), 5, '0', STR_PAD_LEFT);
    }

    protected function casts(): array
    {
        return [
            'status' => JobApplicationStatus::class,
            'date_of_birth' => 'date',
            'years_of_experience' => 'integer',
            'cv_size' => 'integer',
            'certificates_size' => 'integer',
            'applied_at' => 'datetime',
        ];
    }

    /** The vacancy this application was submitted against. */
    public function opening(): BelongsTo
    {
        return $this->belongsTo(Opening::class);
    }

    /* ---- Query scopes for the HR dashboard ---- */

    /** Applications still in the running. */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', JobApplicationStatus::activeValues());
    }

    /** Applications matching a triage status. The value is validated upstream. */
    public function scopeOfStatus(Builder $query, ?string $status): Builder
    {
        return $query->when($status, fn (Builder $q, $value) => $q->where('status', $value));
    }

    /** Free-text search across the applicant's identity and position. */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);

        return $query->when($term, function (Builder $q) use ($term) {
            $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

            $q->where(function (Builder $inner) use ($like) {
                $inner->where('full_name', 'like', $like)
                    ->orWhere('application_number', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('phone', 'like', $like)
                    ->orWhere('position_applied_for', 'like', $like);
            });
        });
    }

    /* ---- Attachment helpers ---- */

    /** Publicly reachable URL for the uploaded CV. */
    protected function cvUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->storedUrl($this->cv_path));
    }

    /** Publicly reachable URL for the uploaded certificates, if any. */
    protected function certificatesUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->storedUrl($this->certificates_path));
    }

    /** Resolve a public-disk path to a URL, tolerating a missing file. */
    private function storedUrl(?string $path): ?string
    {
        return $path ? Storage::disk('public')->url($path) : null;
    }

    /**
     * Delete every stored attachment for this application.
     */
    public function deleteAttachments(): void
    {
        Storage::disk('public')->delete(array_filter([
            $this->cv_path,
            $this->certificates_path,
        ]));
    }

    /**
     * Wrap the insert in a transaction so a duplicate application number can be
     * retried without leaving a partially written row behind.
     */
    public static function persistWithNumber(array $attributes): self
    {
        return DB::transaction(function () use ($attributes) {
            $attributes['application_number'] ??= static::nextNumber();

            return static::create($attributes);
        });
    }
}
