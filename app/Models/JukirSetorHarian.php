<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JukirSetorHarian extends Model
{
    use HasFactory;

    protected $table = 'jukir_setor_harian';

    protected $fillable = [
        'jukir_id',
        'petugas_id',
        'kode_transaksi',
        'external_id',
        'tanggal',
        'jam',
        'nominal_setor',
        'metode_pembayaran',
        'status',
        'bukti_setor',
        'keterangan',
        'payload_response',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal_setor' => 'decimal:2',
        'payload_response' => 'array', // Otomatis serialize & deserialize JSON dari BJB / TSMPayment
    ];

    /**
     * Relasi ke Juru Parkir yang menyetor / menerima pembayaran
     */
    public function jukir()
    {
        return $this->belongsTo(Jukir::class, 'jukir_id')->withTrashed();
    }

    /**
     * Relasi ke Petugas / Admin UPTD yang memvalidasi setoran tunai
     */
    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    /**
     * Scope untuk menyaring transaksi yang berhasil (Success)
     */
    public function scopeSuccess($query)
    {
        return $query->where('status', 'Success');
    }

    /**
     * Scope untuk menyaring transaksi hari ini
     */
    public function scopeHariIni($query)
    {
        return $query->whereDate('tanggal', now()->toDateString());
    }

    /**
     * Scope untuk menyaring transaksi bulan berjalan
     */
    public function scopeBulanIni($query)
    {
        return $query->whereMonth('tanggal', now()->month)
                     ->whereYear('tanggal', now()->year);
    }
}

