<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StrukturOrganisasiPersonel;
use Illuminate\Support\Facades\Storage;

class StrukturOrganisasiController extends Controller
{
    public function index()
    {
        $query = StrukturOrganisasiPersonel::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', '%' . $search . '%')
                  ->orWhere('jabatan', 'like', '%' . $search . '%')
                  ->orWhere('nip', 'like', '%' . $search . '%');
            });
        }

        $personel = $query
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($personel);
        }

        return Inertia::render('Backend/StrukturOrganisasi/Index', [
            'personel' => $personel,
            'filters' => request()->only(['search', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:150',
            'jabatan' => 'required|string|max:100',
            'nip' => 'nullable|string|max:50',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'nama.required' => 'Nama personel harus diisi.',
            'nama.max' => 'Nama maksimal 150 karakter.',
            'jabatan.required' => 'Jabatan harus diisi.',
            'jabatan.max' => 'Jabatan maksimal 100 karakter.',
            'nip.max' => 'NIP maksimal 50 karakter.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('personel', 'public');
        }

        StrukturOrganisasiPersonel::create($validated);

        return redirect()->back()->with('success', 'Personel berhasil ditambahkan.');
    }

    public function update(Request $request, StrukturOrganisasiPersonel $struktur_organisasi)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:150',
            'jabatan' => 'required|string|max:100',
            'nip' => 'nullable|string|max:50',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'nama.required' => 'Nama personel harus diisi.',
            'nama.max' => 'Nama maksimal 150 karakter.',
            'jabatan.required' => 'Jabatan harus diisi.',
            'jabatan.max' => 'Jabatan maksimal 100 karakter.',
            'nip.max' => 'NIP maksimal 50 karakter.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            if ($struktur_organisasi->foto && Storage::disk('public')->exists($struktur_organisasi->foto)) {
                Storage::disk('public')->delete($struktur_organisasi->foto);
            }
            $validated['foto'] = $request->file('foto')->store('personel', 'public');
        } else {
            unset($validated['foto']);
        }

        $struktur_organisasi->update($validated);

        return redirect()->back()->with('success', 'Data personel berhasil diperbarui.');
    }

    public function destroy(StrukturOrganisasiPersonel $struktur_organisasi)
    {
        if ($struktur_organisasi->foto && Storage::disk('public')->exists($struktur_organisasi->foto)) {
            Storage::disk('public')->delete($struktur_organisasi->foto);
        }

        $struktur_organisasi->delete();

        return redirect()->back()->with('success', 'Personel berhasil dihapus.');
    }
}
