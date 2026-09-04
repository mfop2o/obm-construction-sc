<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ContactSetting — the single-row company contact details shown on the
 * Contact page (phone, email, head-office address).
 */
#[Fillable(['phone', 'email', 'address_line_1', 'address_line_2'])]
class ContactSetting extends Model
{
    /** @use HasFactory<\Database\Factories\ContactSettingFactory> */
    use HasFactory;

    /** Return the single settings row, creating it with defaults if absent. */
    public static function firstOrCreateDefault(): self
    {
        return static::first() ?? static::create([
            'phone' => '+251 11 000 0000',
            'email' => 'info@obmconstruction.com',
            'address_line_1' => 'Bole Road, Addis Ababa',
            'address_line_2' => 'Ethiopia',
        ]);
    }
}