<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanduanJukir extends Model
{
    protected $table = 'panduan_jukir';

    protected $fillable = [
        'foto',
        'deskripsi',
        'teks_info',
    ];
}
