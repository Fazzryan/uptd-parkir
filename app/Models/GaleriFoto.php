<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $appends = [
        'fotos',
    ];

    protected $with = [
        'items',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(GaleriFotoItem::class, 'galeri_foto_id');
    }

    /**
     * Accessor untuk mendapatkan array foto (maksimal 4 foto)
     */
    public function getFotosAttribute(): array
    {
        if ($this->relationLoaded('items') && $this->items->isNotEmpty()) {
            return $this->items->pluck('foto')->toArray();
        }

        if (empty($this->foto)) {
            return [];
        }

        if (is_array($this->foto)) {
            return array_slice($this->foto, 0, 4);
        }

        $decoded = json_decode($this->foto, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return array_slice($decoded, 0, 4);
        }

        return [$this->foto];
    }
}
