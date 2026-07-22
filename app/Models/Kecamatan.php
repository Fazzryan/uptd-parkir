<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_kecamatan',
        'nama_kecamatan',
        'latitude',
        'longitude',
        'alamat',
    ];

    public function wilayahParkir()
    {
        return $this->hasMany(WilayahParkir::class, 'kecamatan_id');
    }
}
