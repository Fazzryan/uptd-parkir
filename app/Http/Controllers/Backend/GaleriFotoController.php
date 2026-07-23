<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\GaleriFoto;
use App\Models\GaleriFotoItem;
use Illuminate\Support\Facades\Storage;

class GaleriFotoController extends Controller
{
    public function index()
    {
        $query = GaleriFoto::query()->with('items');

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
            'fotos' => 'nullable|array|max:4',
            'fotos.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'caption.required' => 'Caption foto harus diisi.',
            'kategori.required' => 'Kategori foto harus diisi.',
            'tanggal.required' => 'Tanggal kegiatan harus diisi.',
            'fotos.max' => 'Foto kegiatan maksimal 4 foto.',
            'fotos.*.image' => 'File harus berupa gambar.',
            'fotos.*.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'fotos.*.max' => 'Ukuran setiap gambar maksimal 2MB.',
        ]);

        unset($validated['fotos'], $validated['foto']);
        $galeri = GaleriFoto::create($validated);

        $storedPaths = [];
        if ($request->hasFile('fotos')) {
            foreach (array_slice($request->file('fotos'), 0, 4) as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('galeri', 'public');
                    $storedPaths[] = $path;
                    GaleriFotoItem::create([
                        'galeri_foto_id' => $galeri->id,
                        'foto' => $path,
                    ]);
                }
            }
        } elseif ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('galeri', 'public');
            $storedPaths[] = $path;
            GaleriFotoItem::create([
                'galeri_foto_id' => $galeri->id,
                'foto' => $path,
            ]);
        }

        if (!empty($storedPaths)) {
            $galeri->update(['foto' => $storedPaths[0]]);
        }

        return redirect()->back()->with('success', 'Galeri foto berhasil ditambahkan.');
    }

    public function update(Request $request, GaleriFoto $galeri_foto)
    {
        $validated = $request->validate([
            'caption' => 'required|string|max:255',
            'kategori' => 'required|string|max:50',
            'tanggal' => 'required|date',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'fotos' => 'nullable|array|max:4',
            'fotos.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'deleted_item_ids' => 'nullable|array',
            'deleted_item_ids.*' => 'integer',
        ], [
            'caption.required' => 'Caption foto harus diisi.',
            'kategori.required' => 'Kategori foto harus diisi.',
            'tanggal.required' => 'Tanggal kegiatan harus diisi.',
            'fotos.max' => 'Foto kegiatan maksimal 4 foto.',
            'fotos.*.image' => 'File harus berupa gambar.',
            'fotos.*.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'fotos.*.max' => 'Ukuran setiap gambar maksimal 2MB.',
        ]);

        // 1. Hapus item foto yang dipilih admin untuk dihapus
        if ($request->filled('deleted_item_ids')) {
            $itemsToDelete = GaleriFotoItem::where('galeri_foto_id', $galeri_foto->id)
                ->whereIn('id', $request->deleted_item_ids)
                ->get();

            foreach ($itemsToDelete as $item) {
                if ($item->foto && Storage::disk('public')->exists($item->foto)) {
                    Storage::disk('public')->delete($item->foto);
                }
                $item->delete();
            }
        }

        // 2. Hitung jumlah foto yang tersisa
        $currentCount = $galeri_foto->items()->count();
        $allowedNew = max(0, 4 - $currentCount);

        // 3. Simpan foto-foto baru (jika ada)
        if ($request->hasFile('fotos') && $allowedNew > 0) {
            foreach (array_slice($request->file('fotos'), 0, $allowedNew) as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('galeri', 'public');
                    GaleriFotoItem::create([
                        'galeri_foto_id' => $galeri_foto->id,
                        'foto' => $path,
                    ]);
                }
            }
        } elseif ($request->hasFile('foto') && $currentCount == 0) {
            $path = $request->file('foto')->store('galeri', 'public');
            GaleriFotoItem::create([
                'galeri_foto_id' => $galeri_foto->id,
                'foto' => $path,
            ]);
        }

        // 4. Update data induk (caption, kategori, tanggal)
        unset($validated['fotos'], $validated['foto'], $validated['deleted_item_ids']);

        $firstItem = $galeri_foto->items()->first();
        if ($firstItem) {
            $validated['foto'] = $firstItem->foto;
        }

        $galeri_foto->update($validated);

        return redirect()->back()->with('success', 'Galeri foto berhasil diperbarui.');
    }

    public function destroy(GaleriFoto $galeri_foto)
    {
        foreach ($galeri_foto->items as $item) {
            if ($item->foto && Storage::disk('public')->exists($item->foto)) {
                Storage::disk('public')->delete($item->foto);
            }
        }

        $galeri_foto->delete();

        return redirect()->back()->with('success', 'Galeri foto berhasil dihapus.');
    }

    public function deleteItem(GaleriFotoItem $item)
    {
        if ($item->foto && Storage::disk('public')->exists($item->foto)) {
            Storage::disk('public')->delete($item->foto);
        }
        $item->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus.');
    }
}
