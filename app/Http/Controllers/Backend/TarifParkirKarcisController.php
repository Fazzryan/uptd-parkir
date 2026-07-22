<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TarifParkirKarcis;
use Illuminate\Support\Facades\Storage;

class TarifParkirKarcisController extends Controller
{
    public function index()
    {
        $query = TarifParkirKarcis::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('kategori_kendaraan', 'like', '%' . $search . '%')
                  ->orWhere('nominal_tarif', 'like', '%' . $search . '%')
                  ->orWhere('keterangan', 'like', '%' . $search . '%');
            });
        }

        $tarif = $query
            ->latest()
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($tarif);
        }

        return Inertia::render('Backend/TarifParkirKarcis/Index', [
            'tarif' => $tarif,
            'filters' => request()->only(['search', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori_kendaraan' => 'required|string|max:255',
            'nominal_tarif' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string|max:255',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'kategori_kendaraan.required' => 'Kategori kendaraan harus diisi.',
            'nominal_tarif.required' => 'Nominal tarif harus diisi.',
            'nominal_tarif.numeric' => 'Nominal tarif harus berupa angka.',
            'nominal_tarif.min' => 'Nominal tarif tidak boleh bernilai negatif.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('tarif-parkir', 'public');
        }

        TarifParkirKarcis::create($validated);

        return redirect()->back()->with('success', 'Tarif parkir berhasil ditambahkan.');
    }

    public function update(Request $request, TarifParkirKarcis $tarif_parkir)
    {
        $validated = $request->validate([
            'kategori_kendaraan' => 'required|string|max:255',
            'nominal_tarif' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string|max:255',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'kategori_kendaraan.required' => 'Kategori kendaraan harus diisi.',
            'nominal_tarif.required' => 'Nominal tarif harus diisi.',
            'nominal_tarif.numeric' => 'Nominal tarif harus berupa angka.',
            'nominal_tarif.min' => 'Nominal tarif tidak boleh bernilai negatif.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            if ($tarif_parkir->foto && Storage::disk('public')->exists($tarif_parkir->foto)) {
                Storage::disk('public')->delete($tarif_parkir->foto);
            }
            $validated['foto'] = $request->file('foto')->store('tarif-parkir', 'public');
        } else {
            unset($validated['foto']);
        }

        $tarif_parkir->update($validated);

        return redirect()->back()->with('success', 'Tarif parkir berhasil diperbarui.');
    }

    public function destroy(TarifParkirKarcis $tarif_parkir)
    {
        if ($tarif_parkir->foto && Storage::disk('public')->exists($tarif_parkir->foto)) {
            Storage::disk('public')->delete($tarif_parkir->foto);
        }

        $tarif_parkir->delete();

        return redirect()->back()->with('success', 'Tarif parkir berhasil dihapus.');
    }
}
