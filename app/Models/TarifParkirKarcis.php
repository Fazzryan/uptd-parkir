<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TarifParkirKarcis extends Model
{
    protected $table = 'tarif_parkir_karcis';

    protected $fillable = [
        'foto',
    ];
}
