<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WilayahParkir;
use App\Models\Kecamatan;

class WilayahParkirController extends Controller
{
    public function index()
    {
        $query = WilayahParkir::query()->with('kecamatan');

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_jalan', 'like', '%' . $search . '%')
                  ->orWhereHas('kecamatan', function ($k) use ($search) {
                      $k->where('nama_kecamatan', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($kecamatanId = request('kecamatan_id')) {
            $query->where('kecamatan_id', $kecamatanId);
        }

        $wilayah = $query
            ->paginate(request('per_page', 10))
            ->withQueryString();

        $kecamatanList = Kecamatan::orderBy('nama_kecamatan', 'asc')->get();

        if (request()->wantsJson()) {
            return response()->json($wilayah);
        }
        
        return Inertia::render('Backend/WilayahParkir/Index', [
            'wilayah' => $wilayah,
            'kecamatanList' => $kecamatanList,
            'filters' => request()->only(['search', 'kecamatan_id', 'per_page']),
        ]);
    }
    
    public function store(Request $request) {
        $validated = $request->validate([
            'kecamatan_id' => 'required|exists:kecamatans,id',
            'nama_jalan' => 'required|string|max:255',
            'latitude' => 'required|string|max:255',
            'longitude' => 'required|string|max:255',
        ], [
            'kecamatan_id.required' => 'Kecamatan harus dipilih.',
            'kecamatan_id.exists' => 'Kecamatan yang dipilih tidak valid.',
            'nama_jalan.required' => 'Nama jalan harus diisi.',
            'nama_jalan.max' => 'Nama jalan maksimal 255 karakter.',
            'latitude.required' => 'Latitude harus diisi.',
            'longitude.required' => 'Longitude harus diisi.',
        ]);

        WilayahParkir::create($validated);

        return redirect()->back()->with('success', 'Wilayah parkir berhasil ditambahkan.');
    }

    public function update(Request $request, WilayahParkir $wilayah_parkir) {
        $validated = $request->validate([
            'kecamatan_id' => 'required|exists:kecamatans,id',
            'nama_jalan' => 'required|string|max:255',
            'latitude' => 'required|string|max:255',
            'longitude' => 'required|string|max:255',
        ], [
            'kecamatan_id.required' => 'Kecamatan harus dipilih.',
            'kecamatan_id.exists' => 'Kecamatan yang dipilih tidak valid.',
            'nama_jalan.required' => 'Nama jalan harus diisi.',
            'nama_jalan.max' => 'Nama jalan maksimal 255 karakter.',
            'latitude.required' => 'Latitude harus diisi.',
            'longitude.required' => 'Longitude harus diisi.',
        ]);

        $wilayah_parkir->update($validated);

        return redirect()->back()->with('success', 'Wilayah parkir berhasil diperbarui.');
    }

    public function destroy(WilayahParkir $wilayah_parkir) {
        $wilayah_parkir->delete();

        return redirect()->back()->with('success', 'Wilayah parkir berhasil dihapus.');
    }
}
