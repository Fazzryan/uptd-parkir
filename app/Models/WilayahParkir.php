<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WilayahParkir extends Model
{
    protected $table = 'wilayah_parkir';

    protected $fillable = [
        'kecamatan',
        'nama_jalan',
        'latitude',
        'longitude',
    ];
}
