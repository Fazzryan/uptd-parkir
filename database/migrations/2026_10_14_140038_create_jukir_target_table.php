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
        Schema::create('jukir_target', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel jukir (1 jukir memiliki target bulanan)
            $table->foreignId('jukir_id')->constrained('jukir')->cascadeOnDelete();

            // Periode target
            $table->smallInteger('tahun'); // Tahun target, contoh: 2026
            $table->tinyInteger('bulan');  // Bulan target (1 - 12)
            $table->tinyInteger('jml_hari')->default(26); // Jumlah hari kerja aktif dalam 1 bulan

            // Rincian nominal target retribusi / PAD
            $table->decimal('target_per_hari', 12, 2)->default(0);
            $table->decimal('total_target', 14, 2)->default(0);
            $table->text('keterangan')->nullable();

            $table->timestamps();

            // Constraint agar 1 jukir tidak memiliki target ganda di bulan & tahun yang sama
            $table->unique(['jukir_id', 'tahun', 'bulan']);
            $table->index(['tahun', 'bulan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jukir_target');
    }
};

