<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WilayahParkir;

class WilayahParkirController extends Controller
{
    public function index()
    {
        $query = WilayahParkir::query();

        if (request('search')) {
            $query->where('nama_jalan', 'like', '%' . request('search') . '%')
            ->orWhere('kecamatan', 'like', '%' . request('search') . '%');
        }

        $wilayah = $query
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($wilayah);
        }
        
        return Inertia::render('Backend/WilayahParkir/Index', [
            'wilayah' => $wilayah,
            'filters' => request()->only(['search', 'per_page']),
        ]);
    }
    
    public function store(Request $request) {
        $validated = $request->validate([
            'kecamatan' => 'required|string|max:255',
            'nama_jalan' => 'required|string|max:255',
            'latitude' => 'required|string|max:255',
            'longitude' => 'required|string|max:255',
        ], [
            'kecamatan.required' => 'Kecamatan harus diisi.',
            'kecamatan.string' => 'Kecamatan harus berupa string.',
            'kecamatan.max' => 'Kecamatan maksimal 255 karakter.',
            'nama_jalan.required' => 'Nama jalan harus diisi.',
            'nama_jalan.string' => 'Nama jalan harus berupa string.',
            'nama_jalan.max' => 'Nama jalan maksimal 255 karakter.',
            'latitude.required' => 'Latitude harus diisi.',
            'latitude.string' => 'Latitude harus berupa string.',
            'latitude.max' => 'Latitude maksimal 255 karakter.',
            'longitude.required' => 'Longitude harus diisi.',
            'longitude.string' => 'Longitude harus berupa string.',
            'longitude.max' => 'Longitude maksimal 255 karakter.',
        ]);

        WilayahParkir::create($validated);

        return redirect()->back()->with('success', 'Wilayah parkir berhasil ditambahkan.');
    }

    public function update(Request $request, WilayahParkir $wilayah) {
        $validated = $request->validate([
            'kecamatan' => 'required|string|unique:wilayah_parkir,kecamatan,' . $wilayah->id . '|max:255',
            'nama_jalan' => 'required|string|max:255',
            'latitude' => 'required|string|max:255',
            'longitude' => 'required|string|max:255',
        ], [
            'kecamatan.required' => 'Kecamatan harus diisi.',
            'kecamatan.string' => 'Kecamatan harus berupa string.',
            'kecamatan.unique' => 'Kecamatan sudah ada.',
            'kecamatan.max' => 'Kecamatan maksimal 255 karakter.',
            'nama_jalan.required' => 'Nama jalan harus diisi.',
            'nama_jalan.string' => 'Nama jalan harus berupa string.',
            'nama_jalan.max' => 'Nama jalan maksimal 255 karakter.',
            'latitude.required' => 'Latitude harus diisi.',
            'latitude.string' => 'Latitude harus berupa string.',
            'latitude.max' => 'Latitude maksimal 255 karakter.',
            'longitude.required' => 'Longitude harus diisi.',
            'longitude.string' => 'Longitude harus berupa string.',
            'longitude.max' => 'Longitude maksimal 255 karakter.',
        ]);

        $wilayah->update($validated);

        return redirect()->back()->with('success', 'Wilayah parkir berhasil diperbarui.');
    }

    public function destroy(WilayahParkir $wilayah) {
        $wilayah->delete();

        return redirect()->back()->with('success', 'Wilayah parkir berhasil dihapus.');
    }
}
