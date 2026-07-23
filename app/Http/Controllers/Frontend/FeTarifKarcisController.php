<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\TarifParkirKarcis;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeTarifKarcisController extends Controller
{
    public function index()
    {
        $tarifParkir = TarifParkirKarcis::orderBy('id', 'asc')->get();

        return Inertia::render('Frontend/TarifKarcis', [
            'tarifParkir' => $tarifParkir,
        ]);
    }
}

