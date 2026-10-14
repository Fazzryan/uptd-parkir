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
        Schema::create('jukir', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('wilayah_parkir_id')->nullable()->constrained('wilayah_parkir')->nullOnDelete();
            $table->string('kode_jukir', 50)->unique();
            $table->string('nama');
            $table->string('nohp', 15);
            $table->string('alamat');
            $table->string('foto');
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif');
            $table->softDeletes();
            $table->timestamps();

            // indexing
            $table->index(['status']);
            $table->index(['user_id']);
            $table->index(['wilayah_parkir_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jukir');
    }
};
