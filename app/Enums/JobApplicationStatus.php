<?php

namespace App\Enums;

/**
 * JobApplicationStatus — the HR triage states for an online job application.
 *
 * Applications start as New and move through review, shortlisting, interview
 * and selection. Rejected is terminal for candidates who were considered and
 * not taken forward.
 */
enum JobApplicationStatus: string
{
    case New = 'new';
    case UnderReview = 'under_review';
    case Shortlisted = 'shortlisted';
    case Interview = 'interview';
    case Selected = 'selected';
    case Rejected = 'rejected';

    /** Every status in triage order. */
    public static function options(): array
    {
        return array_map(
            static fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }

    /** A human label for the status. */
    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::UnderReview => 'Under Review',
            self::Shortlisted => 'Shortlisted',
            self::Interview => 'Interview',
            self::Selected => 'Selected',
            self::Rejected => 'Rejected',
        };
    }

    /** Whether the application has been triaged past the initial queue. */
    public function isOpen(): bool
    {
        return ! in_array($this, [self::Selected, self::Rejected], true);
    }

    /** Statuses that count as "still in the running" for reporting. */
    public static function activeValues(): array
    {
        return [
            self::New->value,
            self::UnderReview->value,
            self::Shortlisted->value,
            self::Interview->value,
        ];
    }
}
