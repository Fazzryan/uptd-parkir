<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WilayahParkir extends Model
{
    use HasFactory;

    protected $table = 'wilayah_parkir';

    protected $fillable = [
        'kecamatan_id',
        'nama_jalan',
        'latitude',
        'longitude',
    ];

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id');
    }

    /**
     * Relasi ke jukir yang bertugas di lokasi ini (1 lokasi bisa dijaga banyak jukir)
     */
    public function jukir()
    {
        return $this->hasMany(Jukir::class, 'wilayah_parkir_id');
    }
}
