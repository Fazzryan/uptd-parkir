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
        Schema::create('wilayah_parkir', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan', 50);
            $table->string('nama_jalan', 50);
            $table->string('latitude', 20);
            $table->string('longitude', 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wilayah_parkir');
    }
};
