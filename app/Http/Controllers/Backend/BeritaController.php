<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Berita;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    public function index()
    {
        $query = Berita::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                  ->orWhere('kategori', 'like', '%' . $search . '%')
                  ->orWhere('ringkasan', 'like', '%' . $search . '%');
            });
        }

        if ($kategori = request('kategori')) {
            if ($kategori !== 'Semua') {
                $query->where('kategori', $kategori);
            }
        }

        $berita = $query
            ->latest('tanggal')
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($berita);
        }

        return Inertia::render('Backend/Berita/Index', [
            'berita' => $berita,
            'filters' => request()->only(['search', 'kategori', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:50',
            'tanggal' => 'required|date',
            'ringkasan' => 'nullable|string',
            'isi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'judul.required' => 'Judul berita harus diisi.',
            'kategori.required' => 'Kategori berita harus diisi.',
            'tanggal.required' => 'Tanggal publikasi harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        $validated['slug'] = Str::slug($request->judul) . '-' . Str::random(5);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('berita', 'public');
        }

        Berita::create($validated);

        return redirect()->back()->with('success', 'Berita berhasil ditambahkan.');
    }

    public function update(Request $request, Berita $beritum)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:50',
            'tanggal' => 'required|date',
            'ringkasan' => 'nullable|string',
            'isi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'judul.required' => 'Judul berita harus diisi.',
            'kategori.required' => 'Kategori berita harus diisi.',
            'tanggal.required' => 'Tanggal publikasi harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            if ($beritum->foto && Storage::disk('public')->exists($beritum->foto)) {
                Storage::disk('public')->delete($beritum->foto);
            }
            $validated['foto'] = $request->file('foto')->store('berita', 'public');
        } else {
            unset($validated['foto']);
        }

        $beritum->update($validated);

        return redirect()->back()->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Berita $beritum)
    {
        if ($beritum->foto && Storage::disk('public')->exists($beritum->foto)) {
            Storage::disk('public')->delete($beritum->foto);
        }

        $beritum->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus.');
    }
}
