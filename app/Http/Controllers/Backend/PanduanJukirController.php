<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PanduanJukir;
use Illuminate\Support\Facades\Storage;

class PanduanJukirController extends Controller
{
    public function index()
    {
        $query = PanduanJukir::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('teks_info', 'like', '%' . $search . '%')
                  ->orWhere('deskripsi', 'like', '%' . $search . '%');
            });
        }

        $panduan = $query
            ->latest()
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($panduan);
        }

        return Inertia::render('Backend/PanduanJukir/Index', [
            'panduan' => $panduan,
            'filters' => request()->only(['search', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teks_info' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'foto' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'teks_info.required' => 'Teks info / judul panduan harus diisi.',
            'teks_info.max' => 'Teks info maksimal 255 karakter.',
            'deskripsi.required' => 'Deskripsi panduan harus diisi.',
            'foto.required' => 'Foto / ilustrasi panduan wajib diunggah.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('panduan-jukir', 'public');
        }

        PanduanJukir::create($validated);

        return redirect()->back()->with('success', 'Panduan jukir berhasil ditambahkan.');
    }

    public function update(Request $request, PanduanJukir $panduan_jukir)
    {
        $validated = $request->validate([
            'teks_info' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'teks_info.required' => 'Teks info / judul panduan harus diisi.',
            'teks_info.max' => 'Teks info maksimal 255 karakter.',
            'deskripsi.required' => 'Deskripsi panduan harus diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            if ($panduan_jukir->foto && Storage::disk('public')->exists($panduan_jukir->foto)) {
                Storage::disk('public')->delete($panduan_jukir->foto);
            }
            $validated['foto'] = $request->file('foto')->store('panduan-jukir', 'public');
        } else {
            unset($validated['foto']);
        }

        $panduan_jukir->update($validated);

        return redirect()->back()->with('success', 'Panduan jukir berhasil diperbarui.');
    }

    public function destroy(PanduanJukir $panduan_jukir)
    {
        if ($panduan_jukir->foto && Storage::disk('public')->exists($panduan_jukir->foto)) {
            Storage::disk('public')->delete($panduan_jukir->foto);
        }

        $panduan_jukir->delete();

        return redirect()->back()->with('success', 'Panduan jukir berhasil dihapus.');
    }
}
