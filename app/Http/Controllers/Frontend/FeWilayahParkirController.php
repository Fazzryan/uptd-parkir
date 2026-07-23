<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\WilayahParkir;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeWilayahParkirController extends Controller
{
    public function index()
    {
        $wilayahParkir = WilayahParkir::with('kecamatan')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Frontend/WilayahParkir', [
            'wilayahParkir' => $wilayahParkir,
        ]);
    }
}


