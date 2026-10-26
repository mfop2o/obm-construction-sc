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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('project_type')->nullable();
            $table->string('project_location')->nullable();
            $table->string('budget_range')->nullable();
            $table->string('start_timeline')->nullable();
            $table->text('message');
            $table->string('preferred_contact')->default('email');
            $table->boolean('consent')->default(false);

            // Attachment metadata — path is stored on the public disk.
            $table->string('attachment_path')->nullable();
            $table->string('attachment_name')->nullable();
            $table->unsignedBigInteger('attachment_size')->nullable();
            $table->string('attachment_mime')->nullable();

            // Admin management — never exposed publicly.
            $table->string('status')
                ->default('new')
                ->index();
            $table->text('internal_note')->nullable();
            $table->date('follow_up_at')->nullable();
            $table->boolean('read')->default(false);

            $table->timestamps();

            $table->index('created_at');
            $table->index(['status', 'read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
