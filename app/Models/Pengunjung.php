<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengunjung extends Model
{
    use HasFactory;

    protected $table = 'pengunjungs';

    protected $fillable = [
        'ip_address',
        'session_id',
        'url',
        'referer',
        'user_agent',
        'device',
        'browser',
        'platform',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];
}
