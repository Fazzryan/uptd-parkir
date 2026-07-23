<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\GaleriFoto;
use App\Models\WilayahParkir;
use App\Models\TarifParkirKarcis;
use App\Models\PanduanJukir;
use App\Models\StrukturOrganisasiPersonel;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        $berita = Berita::latest('tanggal')->take(3)->get();
        $galeri = GaleriFoto::with('items')->latest('tanggal')->take(4)->get();
        $tarif = TarifParkirKarcis::orderBy('id', 'asc')->get();
        $panduan = PanduanJukir::orderBy('id', 'asc')->take(4)->get();

        $stats = [
            'totalWilayah' => WilayahParkir::count(),
            'totalTarif' => TarifParkirKarcis::count(),
            'totalJukir' => PanduanJukir::count(),
            'totalPersonel' => StrukturOrganisasiPersonel::count(),
        ];

        return Inertia::render('Frontend/Beranda', [
            'berita' => $berita,
            'galeri' => $galeri,
            'tarif' => $tarif,
            'panduan' => $panduan,
            'stats' => $stats,
        ]);
    }
}
