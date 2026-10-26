<?php

use App\Enums\ProjectStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the contract, progress and acceptance columns required by the project
     * portal, and normalise legacy status spellings onto the current vocabulary.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Parties and commercial terms.
            $table->string('consultant')->nullable()->after('client');
            $table->string('contractor')->nullable()->after('consultant');
            $table->decimal('contract_amount', 18, 2)->nullable()->after('contractor');
            $table->string('currency', 8)->default('ETB')->after('contract_amount');

            // Programme.
            $table->date('contract_date')->nullable()->after('currency');
            $table->date('start_date')->nullable()->after('contract_date');
            $table->date('completion_date')->nullable()->after('start_date');
            $table->date('acceptance_date')->nullable()->after('completion_date');

            // Reporting / filtering.
            $table->string('region')->nullable()->after('location');
            $table->unsignedTinyInteger('physical_progress')->default(0)->after('region');
            $table->unsignedTinyInteger('financial_progress')->default(0)->after('physical_progress');

            $table->index('status');
            $table->index('region');
            $table->index('completion_date');
        });

        $this->normaliseStatuses();
    }

    /**
     * Legacy rows stored "In Progress" and "Started"; the portal vocabulary uses
     * "Ongoing" for both so the automatic categories resolve correctly.
     */
    private function normaliseStatuses(): void
    {
        foreach (ProjectStatus::legacyMap() as $from => $to) {
            DB::table('projects')->where('status', $from)->update(['status' => $to]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['region']);
            $table->dropIndex(['completion_date']);

            $table->dropColumn([
                'consultant',
                'contractor',
                'contract_amount',
                'currency',
                'contract_date',
                'start_date',
                'completion_date',
                'acceptance_date',
                'region',
                'physical_progress',
                'financial_progress',
            ]);
        });
    }
};
