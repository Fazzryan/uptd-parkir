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
        Schema::create('jukir_setor_harian', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel jukir
            $table->foreignId('jukir_id')->constrained('jukir')->cascadeOnDelete();

            // Petugas / Admin UPTD yang memvalidasi atau menginput (khusus setor tunai)
            $table->foreignId('petugas_id')->nullable()->constrained('users')->nullOnDelete();

            // Identifikasi transaksi & integrasi payment gateway
            $table->string('kode_transaksi', 50)->unique(); // Contoh: TRX-20261014-0001
            $table->string('external_id', 100)->nullable()->index(); // ID transaksi dari Bank BJB / TSMPayment

            // Waktu transaksi / setoran
            $table->date('tanggal')->index();
            $table->time('jam')->nullable();

            // Nominal setoran / pembayaran
            $table->decimal('nominal_setor', 12, 2);

            // Metode pembayaran & status
            $table->enum('metode_pembayaran', ['Tunai', 'QRIS'])->default('Tunai');
            $table->enum('status', ['Pending', 'Success', 'Failed'])->default('Success');

            // Bukti setoran (foto slip fisik / screenshot jika ada)
            $table->string('bukti_setor')->nullable();
            $table->text('keterangan')->nullable();

            // Raw response webhook JSON dari TSMPayment / Bank BJB untuk audit rekonsiliasi
            $table->json('payload_response')->nullable();

            $table->timestamps();

            // Index gabungan untuk mempercepat laporan & filter dashboard
            $table->index(['tanggal', 'status']);
            $table->index(['jukir_id', 'tanggal']);
            $table->index(['metode_pembayaran', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jukir_setor_harian');
    }
};

