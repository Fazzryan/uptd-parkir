<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJukirRequest;
use App\Http\Requests\UpdateJukirRequest;
use App\Models\Jukir;
use App\Models\JukirTarget;
use App\Models\User;
use App\Models\WilayahParkir;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class JukirController extends Controller
{
    public function index()
    {
        $currentYear = (int) date('Y');
        $currentMonth = (int) date('n');

        $query = Jukir::query()->with([
            'user',
            'wilayahParkir.kecamatan:id,nama_kecamatan',
            'targets' => function ($q) use ($currentYear, $currentMonth) {
                $q->where('tahun', $currentYear)->where('bulan', $currentMonth);
            },
        ]);

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', '%'.$search.'%')
                    ->orWhere('nohp', 'like', '%'.$search.'%')
                    ->orWhere('kode_jukir', 'like', '%'.$search.'%');
            });
        }

        $jukir = $query
            ->latest()
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($jukir);
        }

        $wilayahParkir = WilayahParkir::with('kecamatan:id,nama_kecamatan')->select('id', 'nama_jalan', 'kecamatan_id')->get();

        return Inertia::render('Backend/Jukir/Index', [
            'jukir' => $jukir,
            'filters' => request()->only(['search', 'per_page']),
            'wilayahParkir' => $wilayahParkir,
        ]);
    }

    public function create()
    {
        // Ambil daftar user yang belum terhubung dengan data jukir
        $users = User::doesntHave('jukir')
            ->select('id', 'name', 'username', 'email')
            ->orderBy('name', 'asc')
            ->get();

        $wilayahParkir = WilayahParkir::with('kecamatan:id,nama_kecamatan')
            ->select('id', 'nama_jalan', 'kecamatan_id')
            ->orderBy('nama_jalan', 'asc')
            ->get();

        return Inertia::render('Backend/Jukir/Create', [
            'users' => $users,
            'wilayahParkir' => $wilayahParkir,
        ]);
    }

    public function store(StoreJukirRequest $request)
    {
        $validated = $request->validated();
        $fotoPath = null;

        try {
            // bungkus pake db:transaction agar ketika ada error pada saat store, langsung di rollback
            DB::transaction(function () use ($request, $validated, &$fotoPath) {
                // upload foto
                if ($request->hasFile('foto')) {
                    $fotoPath = $request->file('foto')->store('jukir', 'public');
                }

                // bikin user baru
                $user = User::create([
                    'name' => Str::title($validated['nama']),
                    'email' => $validated['email'],
                    'username' => $validated['username'],
                    'password' => Hash::make($validated['password']),
                ]);

                // assign role user
                $user->assignRole('user');

                // Generate Kode Unik Jukir (Format: 4HURUF_WILAYAH-NAMA-4RANDOM)
                $kodeWilayah = 'PKR1';
                if (! empty($validated['wilayah_parkir_id'])) {
                    $wilayah = WilayahParkir::with('kecamatan')->find($validated['wilayah_parkir_id']);
                    if ($wilayah && $wilayah->kecamatan) {
                        $kecName = $wilayah->kecamatan->nama_kecamatan;
                        $kodeKecMap = [
                            'Singaparna'    => 'SGPR',
                            'Ciawi'         => 'CIAW',
                            'Manonjaya'     => 'MNJY',
                            'Rajapolah'     => 'RJPL',
                            'Cineam'        => 'CNEM',
                            'Sukaraja'      => 'SKRJ',
                            'Karangnunggal' => 'KRNG',
                            'Bantarkalong'  => 'BTKL',
                            'Cipatujah'     => 'CPTJ',
                            'Cikatomas'     => 'CKTM',
                            'Taraju'        => 'TRJU',
                            'Bojonggambir'  => 'BJGB',
                            'Puspahiang'    => 'PSPH',
                        ];
                        $kodeWilayah = $kodeKecMap[$kecName] ?? strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $kecName), 0, 4));
                    }
                }

                $firstWord = explode(' ', trim($validated['nama']))[0] ?? 'JUKIR';
                $namaClean = substr(preg_replace('/[^A-Z]/', '', strtoupper($firstWord)), 0, 6) ?: 'JUKIR';

                do {
                    $randomStr = strtoupper(Str::random(4));
                    $kodeJukir = "{$kodeWilayah}-{$namaClean}-{$randomStr}";
                } while (Jukir::where('kode_jukir', $kodeJukir)->exists());

                // Simpan data Jukir dengan foreign key wilayah_parkir_id
                $jukir = Jukir::create([
                    'user_id' => $user->id,
                    'wilayah_parkir_id' => $validated['wilayah_parkir_id'],
                    'kode_jukir' => $kodeJukir,
                    'nama' => Str::title($validated['nama']),
                    'nohp' => $validated['nohp'],
                    'alamat' => $validated['alamat'],
                    'status' => $validated['status'],
                    'foto' => $fotoPath,
                ]);

                // Simpan Target Retribusi jika diisi oleh admin (berlaku untuk 1 tahun penuh / 12 bulan)
                if (!empty($validated['target_per_hari'])) {
                    $tahun = !empty($validated['tahun']) ? (int) $validated['tahun'] : (int) date('Y');
                    $targetPerHari = (float) $validated['target_per_hari'];
                    $jmlHari = !empty($validated['jml_hari']) ? (int) $validated['jml_hari'] : 26;
                    $totalTarget = $targetPerHari * $jmlHari;
                    $keteranganTarget = $validated['keterangan_target'] ?? null;

                    for ($bulan = 1; $bulan <= 12; $bulan++) {
                        JukirTarget::create([
                            'jukir_id' => $jukir->id,
                            'tahun' => $tahun,
                            'bulan' => $bulan,
                            'jml_hari' => $jmlHari,
                            'target_per_hari' => $targetPerHari,
                            'total_target' => $totalTarget,
                            'keterangan' => $keteranganTarget,
                        ]);
                    }
                }
            });

            return redirect()->route('be.data-jukir.index')
                ->with('success', 'Data juru parkir berhasil ditambahkan.');

        } catch (\Exception $e) {
            // Jika proses database gagal dan foto sempat terunggah, hapus kembali fotonya
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }

            return redirect()->back()
                ->with('error', 'Gagal menambahkan data juru parkir: '.$e->getMessage());
        }
    }

    public function show($id)
    {
        $currentYear = (int) date('Y');
        $jukir = Jukir::with([
            'user',
            'wilayahParkir.kecamatan:id,nama_kecamatan',
            'targets' => function ($q) use ($currentYear) {
                $q->where('tahun', $currentYear)->orderBy('bulan', 'asc');
            },
            'setoranHarian' => function ($q) {
                $q->latest('tanggal')->take(10);
            },
        ])->where('kode_jukir', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

        return Inertia::render('Backend/Jukir/Show', [
            'jukir' => $jukir,
        ]);
    }

    public function edit($id)
    {
        $currentYear = (int) date('Y');
        $currentMonth = (int) date('n');

        // 1. Ambil data jukir beserta relasi user, titik wilayah parkir, dan target aktif
        $jukir = Jukir::with([
            'user',
            'wilayahParkir.kecamatan:id,nama_kecamatan',
            'targets' => function ($q) use ($currentYear, $currentMonth) {
                $q->where('tahun', $currentYear)->where('bulan', $currentMonth);
            },
        ])->where('kode_jukir', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

        // 2. Ambil seluruh data titik wilayah parkir untuk opsi dropdown
        $wilayahParkir = WilayahParkir::with('kecamatan:id,nama_kecamatan')
            ->select('id', 'nama_jalan', 'kecamatan_id')
            ->orderBy('nama_jalan', 'asc')
            ->get();

        return Inertia::render('Backend/Jukir/Edit', [
            'jukir' => $jukir,
            'wilayahParkir' => $wilayahParkir,
        ]);
    }

    public function update(UpdateJukirRequest $request, $id)
    {
        $jukir = Jukir::with('user')->where('kode_jukir', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

        $validated = $request->validated();
        $oldFoto = $jukir->foto;
        $newFotoPath = null;

        try {
            DB::transaction(function () use ($request, $validated, $jukir, $oldFoto, &$newFotoPath) {

                // 1. Update Akun Login Pengguna di tabel users
                $userData = [
                    'name' => Str::title($validated['nama']),
                    'email' => $validated['email'],
                    'username' => $validated['username'],
                ];

                // Hanya update password jika diisi oleh admin (opsional)
                if (! empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }

                if ($jukir->user) {
                    $jukir->user->update($userData);
                }

                // 2. Upload foto baru jika ada
                if ($request->hasFile('foto')) {
                    $newFotoPath = $request->file('foto')->store('jukir', 'public');
                    $validated['foto'] = $newFotoPath;

                    // Hapus foto lama dari storage agar server tetap bersih
                    if ($oldFoto && Storage::disk('public')->exists($oldFoto)) {
                        Storage::disk('public')->delete($oldFoto);
                    }
                } else {
                    // Jika tidak upload baru, tetap pertahankan path foto lama
                    unset($validated['foto']);
                }

                // 3. Update data Juru Parkir beserta titik wilayah penugasan
                $jukir->update([
                    'wilayah_parkir_id' => $validated['wilayah_parkir_id'],
                    'nama' => Str::title($validated['nama']),
                    'nohp' => $validated['nohp'],
                    'alamat' => $validated['alamat'],
                    'status' => $validated['status'],
                    ...($newFotoPath ? ['foto' => $newFotoPath] : []),
                ]);

                // 4. Update / Simpan Target Retribusi jika diisi
                if (isset($validated['target_per_hari']) && $validated['target_per_hari'] !== '') {
                    $tahun = !empty($validated['tahun']) ? (int) $validated['tahun'] : (int) date('Y');
                    $targetPerHari = (float) $validated['target_per_hari'];
                    $jmlHari = !empty($validated['jml_hari']) ? (int) $validated['jml_hari'] : 26;
                    $totalTarget = $targetPerHari * $jmlHari;
                    $keteranganTarget = $validated['keterangan_target'] ?? null;

                    for ($bulan = 1; $bulan <= 12; $bulan++) {
                        JukirTarget::updateOrCreate(
                            [
                                'jukir_id' => $jukir->id,
                                'tahun' => $tahun,
                                'bulan' => $bulan,
                            ],
                            [
                                'jml_hari' => $jmlHari,
                                'target_per_hari' => $targetPerHari,
                                'total_target' => $totalTarget,
                                'keterangan' => $keteranganTarget,
                            ]
                        );
                    }
                }
            });

            return redirect()->route('be.data-jukir.index')
                ->with('success', 'Data juru parkir berhasil diperbarui.');

        } catch (\Exception $e) {
            // Jika proses gagal dan sempat upload foto baru, batalkan dan hapus foto barunya
            if ($newFotoPath && Storage::disk('public')->exists($newFotoPath)) {
                Storage::disk('public')->delete($newFotoPath);
            }

            return redirect()->back()
                ->with('error', 'Gagal memperbarui data juru parkir: '.$e->getMessage());
        }
    }

    public function destroy($id)
    {
        $jukir = Jukir::where('kode_jukir', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

        // Alihkan status keaktifan jukir (Aktif <-> Tidak Aktif)
        // Data tidak dihapus secara hard delete atau soft delete agar data historis
        // setoran harian dan target retribusi tetap aman dan terhubung utuh.
        $newStatus = $jukir->status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
        $jukir->update(['status' => $newStatus]);

        $pesan = $newStatus === 'Tidak Aktif'
            ? "Status juru parkir {$jukir->nama} berhasil diubah menjadi Tidak Aktif."
            : "Status juru parkir {$jukir->nama} berhasil diaktifkan kembali.";

        return redirect()->back()->with('success', $pesan);
    }
}
