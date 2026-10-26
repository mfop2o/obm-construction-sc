<?php

namespace App\Models;

use Database\Factories\ProjectPhotoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * ProjectPhoto — one uploaded project photograph.
 *
 * Administrators upload, delete, reorder and promote a cover photo without
 * touching the database. Files live on the public disk; the cover flag is
 * enforced by ProjectPhoto::setCover().
 */
#[Fillable(['project_id', 'path', 'original_name', 'caption', 'is_cover', 'sort_order'])]
class ProjectPhoto extends Model
{
    /** @use HasFactory<ProjectPhotoFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_cover' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** The project this photograph belongs to. */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** Publicly reachable URL for the stored image. */
    protected function url(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->path
            ? Storage::disk('public')->url($this->path)
            : null);
    }

    /** Whether the underlying file is still present on disk. */
    public function fileExists(): bool
    {
        return $this->path !== null && Storage::disk('public')->exists($this->path);
    }

    /**
     * Promote this photo to be the project cover, demoting any previous cover.
     */
    public function setCover(): void
    {
        self::query()
            ->where('project_id', $this->project_id)
            ->whereKeyNot($this->getKey())
            ->update(['is_cover' => false]);

        $this->forceFill(['is_cover' => true])->save();
    }

    /**
     * Delete the row and the underlying file.
     */
    public function removeWithFile(): void
    {
        if ($this->path) {
            Storage::disk('public')->delete($this->path);
        }

        $this->delete();
    }
}
