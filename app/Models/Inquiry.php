<?php

namespace App\Models;

use Database\Factories\InquiryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * Inquiry — a project inquiry / "Request a Quote" submission.
 *
 * Public: visitors submit the form (name, contact, project type, message,
 * optional attachment). The attachment is validated and stored on the
 * public disk so the admin can download it.
 *
 * Admin: inquiries are triaged with a status (new/contacted/qualified/
 * proposal/won/closed), an internal note, a follow-up date, and a read flag.
 * Internal fields are never exposed through any public endpoint.
 */
#[Fillable([
    'name',
    'company',
    'email',
    'phone',
    'project_type',
    'project_location',
    'budget_range',
    'start_timeline',
    'message',
    'preferred_contact',
    'consent',
    'attachment_path',
    'attachment_name',
    'attachment_size',
    'attachment_mime',
    'status',
    'internal_note',
    'follow_up_at',
    'read',
])]
class Inquiry extends Model
{
    /** @use HasFactory<InquiryFactory> */
    use HasFactory;

    /** Statuses, ordered new → closed. */
    public const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'closed'];

    protected function casts(): array
    {
        return [
            'consent' => 'boolean',
            'read' => 'boolean',
            'attachment_size' => 'integer',
            'follow_up_at' => 'date',
        ];
    }

    /** URL-safe view/download URL for the attachment, if one exists. */
    public function attachmentUrl(): ?string
    {
        return $this->attachment_path ? Storage::disk('public')->url($this->attachment_path) : null;
    }

    /** Public: was this inquiry created by the same browser/visitor? (simple guard) */
    public function isNew(): bool
    {
        return $this->status === 'new';
    }
}
