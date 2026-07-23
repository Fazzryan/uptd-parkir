<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\GaleriFoto;
use Inertia\Inertia;

class FeDokumentasiController extends Controller
{
    public function index()
    {
        $galeriFoto = GaleriFoto::latest('tanggal')
            ->paginate(19, ['*'], 'galeri_page')
            ->withQueryString();

        $berita = Berita::latest('tanggal')
            ->paginate(12, ['*'], 'berita_page')
            ->withQueryString();

        return Inertia::render('Frontend/DokumentasiGaleri', [
            'galeriFoto' => $galeriFoto,
            'berita' => $berita,
        ]);
    }

    public function detail($id)
    {
        $berita = Berita::findOrFail($id);
        $beritaTerkait = Berita::where('id', '!=', $id)
            ->latest('tanggal')
            ->take(3)
            ->get();

        return Inertia::render('Frontend/BeritaDetail', [
            'berita' => $berita,
            'beritaTerkait' => $beritaTerkait,
        ]);
    }
}

