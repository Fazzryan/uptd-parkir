<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasiPersonel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeStrukturOrganisasiController extends Controller
{
    public function index()
    {
        $personel = StrukturOrganisasiPersonel::orderBy('id', 'asc')->get();

        return Inertia::render('Frontend/StrukturOrganisasi', [
            'personel' => $personel,
        ]);
    }
}

