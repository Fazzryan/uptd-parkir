<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GaleriFoto extends Model
{
    use HasFactory;

    protected $table = 'galeri_fotos';

    protected $fillable = [
        'kategori',
        'caption',
        'tanggal',
        'foto',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];
}
