<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'projects', 'services', 'testimonials', 'offices', 'openings', 
            'career_values', 'career_benefits', 'home_stats', 'about_settings', 
            'about_values', 'milestones'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->json('translations')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'projects', 'services', 'testimonials', 'offices', 'openings', 
            'career_values', 'career_benefits', 'home_stats', 'about_settings', 
            'about_values', 'milestones'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('translations');
            });
        }
    }
};
