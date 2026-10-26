<?php

namespace App\Models;

use Database\Factories\ProjectHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ProjectHistory — a single dated entry on a project's history timeline.
 *
 * Example: 31 August 2026 — "Project officially accepted by the client."
 * Entries are maintained from the administrator dashboard, so the underlying
 * schema never has to change to record new milestones.
 */
#[Fillable(['project_id', 'occurred_on', 'title', 'description', 'sort_order'])]
class ProjectHistory extends Model
{
    /** @use HasFactory<ProjectHistoryFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'occurred_on' => 'date',
            'sort_order' => 'integer',
        ];
    }

    /** The project this timeline entry belongs to. */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
