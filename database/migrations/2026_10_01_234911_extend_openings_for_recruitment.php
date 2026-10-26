<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the vacancy details a job advertisement and an applicant both need.
     */
    public function up(): void
    {
        Schema::table('openings', function (Blueprint $table) {
            $table->text('qualification')->nullable()->after('blurb');
            $table->text('responsibilities')->nullable()->after('qualification');
            $table->unsignedTinyInteger('experience_years')->nullable()->after('responsibilities');
            $table->date('deadline')->nullable()->after('experience_years');
            $table->boolean('is_active')->default(true)->after('deadline');

            $table->index(['is_active', 'deadline']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('openings', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'deadline']);
            $table->dropColumn([
                'qualification',
                'responsibilities',
                'experience_years',
                'deadline',
                'is_active',
            ]);
        });
    }
};
