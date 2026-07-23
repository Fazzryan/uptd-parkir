<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\PanduanJukir;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FePanduanJukirController extends Controller
{
    public function index()
    {
        $panduanJukir = PanduanJukir::orderBy('id', 'asc')->get();

        return Inertia::render('Frontend/PanduanJukir', [
            'panduanJukir' => $panduanJukir,
        ]);
    }
}

