<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GaleriFotoItem extends Model
{
    use HasFactory;

    protected $table = 'galeri_foto_items';

    protected $fillable = [
        'galeri_foto_id',
        'foto',
    ];

    public function galeriFoto(): BelongsTo
    {
        return $this->belongsTo(GaleriFoto::class, 'galeri_foto_id');
    }
}
