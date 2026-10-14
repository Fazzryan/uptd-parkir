<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JukirTarget extends Model
{
    use HasFactory;

    protected $table = 'jukir_target';

    protected $fillable = [
        'jukir_id',
        'tahun',
        'bulan',
        'jml_hari',
        'target_per_hari',
        'total_target',
        'keterangan',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'bulan' => 'integer',
        'jml_hari' => 'integer',
        'target_per_hari' => 'decimal:2',
        'total_target' => 'decimal:2',
    ];

    /**
     * Relasi ke data Juru Parkir (Pemilik Target)
     */
    public function jukir()
    {
        return $this->belongsTo(Jukir::class, 'jukir_id');
    }

    /**
     * Helper accessor untuk mendapatkan nama bulan dalam Bahasa Indonesia
     */
    public function getNamaBulanAttribute(): string
    {
        $namaBulan = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        return $namaBulan[$this->bulan] ?? '-';
    }
}

