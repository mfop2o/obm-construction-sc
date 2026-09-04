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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category');
            $table->string('year')->nullable();
            $table->string('location')->nullable();
            $table->string('status')->default('Upcoming');
            $table->string('client')->nullable();
            $table->text('description')->nullable();
            $table->longText('overview')->nullable();
            $table->longText('challenge')->nullable();
            $table->longText('approach')->nullable();
            $table->longText('result')->nullable();
            $table->string('visual')->default('facade');
            $table->unsignedInteger('variant')->nullable();
            $table->string('image')->nullable();
            $table->string('size')->default('standard');
            $table->boolean('featured')->default(false);
            $table->json('scope')->nullable();
            $table->json('gallery')->nullable();
            $table->bigInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('featured');
            $table->index('category');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
