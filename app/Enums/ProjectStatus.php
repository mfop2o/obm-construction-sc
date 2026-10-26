<?php

namespace App\Enums;

/**
 * ProjectStatus — the lifecycle states an administrator selects for a project.
 *
 * The website derives its public project categories from this value, so an
 * administrator never has to move a project between categories by hand: when a
 * project changes from Ongoing to Completed it immediately stops appearing
 * under ongoing work and starts appearing under completed work.
 */
enum ProjectStatus: string
{
    case Upcoming = 'Upcoming';
    case Ongoing = 'Ongoing';
    case Completed = 'Completed';
    case Accepted = 'Accepted';
    case Maintenance = 'Under Maintenance';
    case Suspended = 'Suspended';

    /**
     * Legacy status values written before the project portal vocabulary was
     * introduced, mapped onto their current equivalents.
     *
     * @var array<string, string>
     */
    private const LEGACY_MAP = [
        'In Progress' => self::Ongoing->value,
        'Started' => self::Ongoing->value,
        'Maintenance' => self::Maintenance->value,
    ];

    /**
     * The legacy spellings and the current status each maps onto.
     *
     * Migrations use this to rewrite existing rows, so the mapping has exactly
     * one definition.
     *
     * @return array<string, string>
     */
    public static function legacyMap(): array
    {
        return self::LEGACY_MAP;
    }

    /** Every status in the order an administrator sees them. */
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
        return $this->value;
    }

    /** Whether the project has been handed over and accepted by the client. */
    public function isAccepted(): bool
    {
        return $this === self::Accepted;
    }

    /** Whether site works are currently running on the project. */
    public function isOngoing(): bool
    {
        return $this === self::Ongoing;
    }

    /** Whether construction works are finished. */
    public function isFinished(): bool
    {
        return in_array($this, [self::Completed, self::Accepted, self::Maintenance], true);
    }

    /** Normalise a stored value, mapping legacy spellings onto current ones. */
    public static function normalise(?string $value): self
    {
        $value = trim((string) $value);

        return self::tryFrom($value)
            ?? self::tryFrom(self::LEGACY_MAP[$value] ?? '')
            ?? self::Upcoming;
    }
}
