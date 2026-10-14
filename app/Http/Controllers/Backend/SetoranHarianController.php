<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SetoranHarianController extends Controller
{
    public function index()
    {
        return Inertia::render('Backend/SetoranHarian/Index');
    }
}
