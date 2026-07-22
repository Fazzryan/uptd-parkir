<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\GaleriFoto;
use Illuminate\Support\Facades\Storage;

class GaleriFotoController extends Controller
{
    public function index()
    {
        $query = GaleriFoto::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('caption', 'like', '%' . $search . '%')
                  ->orWhere('kategori', 'like', '%' . $search . '%');
            });
        }

        if ($kategori = request('kategori')) {
            if ($kategori !== 'Semua') {
                $query->where('kategori', $kategori);
            }
        }

        $galeri = $query
            ->latest('tanggal')
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($galeri);
        }

        return Inertia::render('Backend/GaleriFoto/Index', [
            'galeri' => $galeri,
            'filters' => request()->only(['search', 'kategori', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'caption' => 'required|string|max:255',
            'kategori' => 'required|string|max:50',
            'tanggal' => 'required|date',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'caption.required' => 'Caption foto harus diisi.',
            'kategori.required' => 'Kategori foto harus diisi.',
            'tanggal.required' => 'Tanggal kegiatan harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('galeri', 'public');
        }

        GaleriFoto::create($validated);

        return redirect()->back()->with('success', 'Galeri foto berhasil ditambahkan.');
    }

    public function update(Request $request, GaleriFoto $galeri_foto)
    {
        $validated = $request->validate([
            'caption' => 'required|string|max:255',
            'kategori' => 'required|string|max:50',
            'tanggal' => 'required|date',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'caption.required' => 'Caption foto harus diisi.',
            'kategori.required' => 'Kategori foto harus diisi.',
            'tanggal.required' => 'Tanggal kegiatan harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            if ($galeri_foto->foto && Storage::disk('public')->exists($galeri_foto->foto)) {
                Storage::disk('public')->delete($galeri_foto->foto);
            }
            $validated['foto'] = $request->file('foto')->store('galeri', 'public');
        } else {
            unset($validated['foto']);
        }

        $galeri_foto->update($validated);

        return redirect()->back()->with('success', 'Galeri foto berhasil diperbarui.');
    }

    public function destroy(GaleriFoto $galeri_foto)
    {
        if ($galeri_foto->foto && Storage::disk('public')->exists($galeri_foto->foto)) {
            Storage::disk('public')->delete($galeri_foto->foto);
        }

        $galeri_foto->delete();

        return redirect()->back()->with('success', 'Galeri foto berhasil dihapus.');
    }
}
