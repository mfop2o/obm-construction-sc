<?php

use App\Enums\JobApplicationStatus;
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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();

            // Human reference handed back to the applicant, e.g. OBM-2026-00125.
            $table->string('application_number')->unique();

            $table->foreignId('opening_id')->nullable()->constrained()->nullOnDelete();

            // Applicant details.
            $table->string('full_name');
            $table->string('gender')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->text('address')->nullable();
            $table->text('education')->nullable();
            $table->text('work_experience')->nullable();
            $table->text('skills')->nullable();
            $table->string('position_applied_for');
            $table->unsignedTinyInteger('years_of_experience')->default(0);
            $table->text('cover_letter')->nullable();

            // Attachments — stored on the public disk so HR can download them.
            $table->string('cv_path');
            $table->string('cv_name')->nullable();
            $table->string('cv_mime')->nullable();
            $table->unsignedBigInteger('cv_size')->nullable();
            $table->string('certificates_path')->nullable();
            $table->string('certificates_name')->nullable();
            $table->string('certificates_mime')->nullable();
            $table->unsignedBigInteger('certificates_size')->nullable();

            // HR triage — never exposed publicly.
            $table->string('status')
                ->default(JobApplicationStatus::New->value)
                ->index();
            $table->text('admin_note')->nullable();

            $table->timestamp('applied_at')->nullable();
            $table->timestamps();

            $table->index(['opening_id', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
