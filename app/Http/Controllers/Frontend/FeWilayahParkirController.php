<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use App\Models\WilayahParkir;
use Inertia\Inertia;

class FeWilayahParkirController extends Controller
{
    public function index()
    {
        // Ambil data wilayah parkir beserta relasi kecamatan,
        // diurutkan berdasarkan nama kecamatan dari A-Z
        // $wilayahParkir = WilayahParkir::with('kecamatan')
        //     ->select('wilayah_parkir.*')
        //     ->leftJoin('kecamatans', 'wilayah_parkir.kecamatan_id', '=', 'kecamatans.id')
        //     ->orderBy('kecamatans.nama_kecamatan', 'asc')
        //     ->get();

        $wilayahParkir = WilayahParkir::with([
            'kecamatan',
            'jukir' => function ($q) {
                $q->where('status', 'Aktif')
                    ->select('id', 'wilayah_parkir_id', 'kode_jukir', 'nama', 'foto', 'nohp', 'status');
            },
        ])
            ->orderBy(
                Kecamatan::select('nama_kecamatan')->whereColumn('kecamatans.id', 'wilayah_parkir.kecamatan_id'),
                'asc'
            )->get();

        return Inertia::render('Frontend/WilayahParkir', [
            'wilayahParkir' => $wilayahParkir,
        ]);
    }
}
