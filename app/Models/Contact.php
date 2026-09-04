<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Contact — a message submitted through the public contact form.
 */
#[Fillable(['name', 'email', 'phone', 'project_type', 'message', 'read'])]
class Contact extends Model
{
    /** @use HasFactory<\Database\Factories\ContactFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'read' => 'boolean',
        ];
    }
}