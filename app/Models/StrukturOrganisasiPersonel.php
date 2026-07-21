<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StrukturOrganisasiPersonel extends Model
{
    protected $table = 'struktur_organisasi_personel';

    protected $fillable = [
        'nama',
        'nip',
        'jabatan',
        'foto',
    ];
}
