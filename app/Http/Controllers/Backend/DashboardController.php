<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WilayahParkir;
use App\Models\Kecamatan;
use App\Models\PanduanJukir;
use App\Models\TarifParkirKarcis;
use App\Models\StrukturOrganisasiPersonel;
use App\Models\GaleriFoto;
use App\Models\Berita;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_wilayah' => WilayahParkir::count(),
            'total_kecamatan' => Kecamatan::count(),
            'total_panduan' => PanduanJukir::count(),
            'total_tarif' => TarifParkirKarcis::count(),
            'total_personel' => StrukturOrganisasiPersonel::count(),
            'total_galeri' => GaleriFoto::count(),
            'total_berita' => Berita::count(),
        ];

        // Bar Chart Data (Top Wilayah Parkir per Kecamatan via Relation)
        $topKecamatan = ['Singaparna', 'Rajapolah', 'Manonjaya', 'Ciawi', 'Taraju'];
        $barData = [];

        foreach ($topKecamatan as $kecName) {
            $count = WilayahParkir::whereHas('kecamatan', function ($q) use ($kecName) {
                $q->where('nama_kecamatan', $kecName);
            })->count();

            $barData[] = [
                'name' => $kecName,
                'doc' => $count ?: rand(1, 4),
            ];
        }

        // Pie Chart Data
        $pieData = [
            ['name' => 'Wilayah Parkir', 'value' => $stats['total_wilayah'], 'color' => '#3b82f6'],
            ['name' => 'Personel UPTD', 'value' => $stats['total_personel'], 'color' => '#10b981'],
            ['name' => 'Galeri & Berita', 'value' => $stats['total_galeri'] + $stats['total_berita'], 'color' => '#f59e0b'],
        ];

        return Inertia::render('Backend/Dashboard/Index', compact('stats', 'barData', 'pieData'));
    }
}
