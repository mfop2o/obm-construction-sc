<?php

namespace App\Models;
use App\Traits\Localizable;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * AboutSetting — the single-row mission/vision text for the About page.
 */
#[Fillable(['translations', 'mission', 'vision'])]
class AboutSetting extends Model
{
    /** @use HasFactory<\Database\Factories\AboutSettingFactory> */
    use HasFactory, Localizable;

    /** Return the single settings row, creating it with defaults if absent. */
    public static function firstOrCreateDefault(): self
    {
        return static::first() ?? static::create([
            'mission' => 'To deliver safe, quality construction projects on time and on budget, creating lasting value for our clients, our people and the communities we serve across Ethiopia.',
            'vision' => 'To be the most trusted and respected construction company in Ethiopia, recognised for engineering excellence, integrity and enduring results.',
        ]);
    }
}