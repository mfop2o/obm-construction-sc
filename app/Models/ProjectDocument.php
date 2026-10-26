<?php

namespace App\Models;

use Database\Factories\ProjectDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * ProjectDocument — a downloadable file attached to a project.
 *
 * Files live on the public disk and are served through an authorised download
 * endpoint rather than a guessable static path.
 */
#[Fillable([
    'project_id',
    'title',
    'path',
    'original_name',
    'file_size',
    'mime',
    'sort_order',
])]
class ProjectDocument extends Model
{
    /** @use HasFactory<ProjectDocumentFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /** The project this document belongs to. */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** Publicly reachable URL for the stored file. */
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
