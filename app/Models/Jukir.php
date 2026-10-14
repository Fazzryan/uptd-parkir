<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Jukir extends Model
{
    use SoftDeletes;

    protected $table = 'jukir';

    protected $fillable = [
        'user_id',
        'wilayah_parkir_id',
        'kode_jukir',
        'nama',
        'nohp',
        'alamat',
        'foto',
        'status', // status keaktifan jukir
    ];

    /**
     * Menggunakan kode_jukir sebagai route key name di URL
     */
    public function getRouteKeyName(): string
    {
        return 'kode_jukir';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke titik lokasi parkir tempat jukir bertugas (One-to-Many: 1 jukir 1 titik lokasi)
     */
    public function wilayahParkir()
    {
        return $this->belongsTo(WilayahParkir::class, 'wilayah_parkir_id');
    }

    /**
     * Relasi ke data target retribusi bulanan jukir
     */
    public function targets()
    {
        return $this->hasMany(JukirTarget::class, 'jukir_id');
    }

    /**
     * Relasi ke riwayat setoran harian / transaksi QRIS & Tunai jukir
     */
    public function setoranHarian()
    {
        return $this->hasMany(JukirSetorHarian::class, 'jukir_id');
    }
}

