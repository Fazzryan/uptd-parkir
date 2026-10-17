<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Jukir;
use App\Models\JukirSetorHarian;
use App\Models\JukirTarget;
use App\Models\Kecamatan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SetoranHarianController extends Controller
{
    /**
     * Menampilkan detail data setoran per juru parkir
     */
    public function detailSetoran(Request $request, $kode_jukir)
    {
        $currentYear = (int) date('Y');
        $currentMonth = (int) date('n');
        $today = Carbon::today()->toDateString();

        // Cari Jukir berdasarkan kode_jukir atau ID (fallback)
        $jukir = Jukir::query()
            ->with([
                'wilayahParkir.kecamatan:id,nama_kecamatan',
                'targets' => function ($q) use ($currentYear, $currentMonth) {
                    $q->where('tahun', $currentYear)->where('bulan', $currentMonth);
                },
            ])
            ->where(function ($q) use ($kode_jukir) {
                $q->where('kode_jukir', $kode_jukir)
                    ->orWhere('id', $kode_jukir);
            })
            ->firstOrFail();

        // Hitung target nominal jukir
        $targetObj = $jukir->targets->first();
        $targetHarian = $targetObj ? (float) $targetObj->target_per_hari : 0;
        $targetBulanan = $targetObj ? (float) $targetObj->total_target : 0;

        // Query riwayat transaksi setoran jukir
        $query = $jukir->setoranHarian()->with('petugas:id,name')->latest('tanggal')->latest('jam');

        // Filter Pencarian (kode transaksi atau keterangan)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_transaksi', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        // Filter Rentang Tanggal
        if ($startDate = $request->input('start_date')) {
            $query->whereDate('tanggal', '>=', $startDate);
        }
        if ($endDate = $request->input('end_date')) {
            $query->whereDate('tanggal', '<=', $endDate);
        }

        // Filter Metode Pembayaran (Tunai / QRIS)
        if ($metode = $request->input('metode_pembayaran')) {
            $query->where('metode_pembayaran', $metode);
        }

        $riwayat = $query->paginate($request->input('per_page', 15))->withQueryString();

        // Ringkasan Statistik Finansial Jukir Ini
        $setorHariIni = (float) $jukir->setoranHarian()
            ->whereDate('tanggal', $today)
            ->where('status', 'Success')
            ->sum('nominal_setor');

        $setorBulanIni = (float) $jukir->setoranHarian()
            ->whereYear('tanggal', $currentYear)
            ->whereMonth('tanggal', $currentMonth)
            ->where('status', 'Success')
            ->sum('nominal_setor');

        $totalSemuaSetor = (float) $jukir->setoranHarian()
            ->where('status', 'Success')
            ->sum('nominal_setor');

        $totalTunai = (float) $jukir->setoranHarian()
            ->where('status', 'Success')
            ->where('metode_pembayaran', 'Tunai')
            ->sum('nominal_setor');

        $totalQRIS = (float) $jukir->setoranHarian()
            ->where('status', 'Success')
            ->where('metode_pembayaran', 'QRIS')
            ->sum('nominal_setor');

        $sisaHariIni = max(0, $targetHarian - $setorHariIni);
        $sisaBulanIni = max(0, $targetBulanan - $setorBulanIni);

        $stats = [
            'setorHariIni' => $setorHariIni,
            'targetHarian' => $targetHarian,
            'sisaHariIni' => $sisaHariIni,
            'setorBulanIni' => $setorBulanIni,
            'targetBulanan' => $targetBulanan,
            'sisaBulanIni' => $sisaBulanIni,
            'totalSemuaSetor' => $totalSemuaSetor,
            'totalTunai' => $totalTunai,
            'totalQRIS' => $totalQRIS,
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'riwayat' => $riwayat,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Backend/SetoranHarian/DetailSetoran', [
            'jukir' => [
                'id' => $jukir->id,
                'kode_jukir' => $jukir->kode_jukir ?? "JKR-{$jukir->id}",
                'nama' => $jukir->nama,
                'nohp' => $jukir->nohp,
                'foto' => $jukir->foto,
                'status' => $jukir->status,
                'titik_parkir' => $jukir->wilayahParkir->nama_jalan ?? '-',
                'kecamatan' => $jukir->wilayahParkir->kecamatan->nama_kecamatan ?? '-',
                'target_harian' => $targetHarian,
                'target_bulanan' => $targetBulanan,
            ],
            'stats' => $stats,
            'riwayat' => $riwayat,
            'filters' => $request->only(['search', 'start_date', 'end_date', 'metode_pembayaran', 'per_page']),
        ]);
    }

    /**
     * Menampilkan dashboard monitoring kendali setoran retribusi parkir
     */
    public function index(Request $request)
    {
        $currentYear = (int) date('Y');
        $currentMonth = (int) date('n');
        $today = Carbon::today()->toDateString();

        // 1. Tentukan Rentang Tanggal berdasarkan Filter Periode
        $periode = $request->input('periode', 'Hari Ini');
        $startDate = $today;
        $endDate = $today;

        if ($periode === 'Hari Ini') {
            $startDate = $today;
            $endDate = $today;
        } elseif ($periode === 'Bulan Ini') {
            $startDate = Carbon::now()->startOfMonth()->toDateString();
            $endDate = Carbon::now()->endOfMonth()->toDateString();
        } elseif ($periode === 'Tahun Ini') {
            $startDate = Carbon::now()->startOfYear()->toDateString();
            $endDate = Carbon::now()->endOfYear()->toDateString();
        } elseif ($periode === 'Rentang') {
            $startDate = $request->input('start_date', $today);
            $endDate = $request->input('end_date', $today);
        }

        // 2. Query Juru Parkir dengan Relasi Wilayah, Kecamatan, dan Target
        $query = Jukir::query()
            ->with([
                'wilayahParkir.kecamatan:id,nama_kecamatan',
                'targets' => function ($q) use ($currentYear, $currentMonth) {
                    $q->where('tahun', $currentYear)->where('bulan', $currentMonth);
                },
                'setoranHarian' => function ($q) {
                    $q->where('status', 'Success')->latest('tanggal')->latest('jam');
                },
            ]);

        // Filter Pencarian (Nama Jukir, Kode Jukir, atau Titik Lokasi Parkir)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_jukir', 'like', "%{$search}%")
                    ->orWhereHas('wilayahParkir', function ($w) use ($search) {
                        $w->where('nama_jalan', 'like', "%{$search}%")
                            ->orWhereHas('kecamatan', function ($k) use ($search) {
                                $k->where('nama_kecamatan', 'like', "%{$search}%");
                            });
                    });
            });
        }

        // Filter Kecamatan (Default ke Kecamatan Singaparna jika pertama kali dibuka tanpa query param)
        $singaparna = Kecamatan::where('nama_kecamatan', 'like', '%Singaparna%')->first();
        $defaultKecamatanId = $singaparna ? (string) $singaparna->id : '';

        // Jika request memiliki parameter kecamatan_id (termasuk "" jika user pilih "Semua Kecamatan"):
        if ($request->has('kecamatan_id')) {
            $kecamatanId = $request->input('kecamatan_id');
        } else {
            // Pertama kali buka halaman: gunakan Singaparna sebagai default
            $kecamatanId = $defaultKecamatanId;
        }

        // Terapkan filter jika kecamatan_id diisi (bukan "" atau null)
        if ($kecamatanId) {
            $query->whereHas('wilayahParkir', function ($w) use ($kecamatanId) {
                $w->where('kecamatan_id', $kecamatanId);
            });
        }

        // Ambil data jukir
        $jukirCollection = $query->orderBy('nama', 'asc')->get();

        // 3. Transformasi Data Jukir & Hitung Target, Setoran, dan Status
        $transformed = $jukirCollection->map(function ($j) use ($periode, $startDate, $endDate) {
            $targetObj = $j->targets->first();
            $targetHarian = $targetObj ? (float) $targetObj->target_per_hari : 0;
            $targetBulanan = $targetObj ? (float) $targetObj->total_target : 0;

            // Hitung target sesuai periode yang dipilih
            if ($periode === 'Hari Ini') {
                $targetNominal = $targetHarian;
            } elseif ($periode === 'Bulan Ini') {
                $targetNominal = $targetBulanan;
            } elseif ($periode === 'Tahun Ini') {
                $targetNominal = $targetBulanan * 12;
            } else {
                // Rentang Tanggal: hitung jumlah hari
                $days = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1;
                $targetNominal = $targetHarian * $days;
            }

            // Hitung total setoran sukses pada rentang periode yang dipilih
            $setoranPeriode = $j->setoranHarian->filter(function ($s) use ($startDate, $endDate) {
                $tgl = Carbon::parse($s->tanggal)->toDateString();

                return $tgl >= $startDate && $tgl <= $endDate && $s->status === 'Success';
            });

            $setorNominal = (float) $setoranPeriode->sum('nominal_setor');
            $jamBayar = $setoranPeriode->sortByDesc('jam')->first()?->jam;

            // Penentuan Status
            if ($targetNominal > 0) {
                if ($setorNominal >= $targetNominal) {
                    $status = 'Lunas';
                } elseif ($setorNominal > 0) {
                    $status = 'Kurang';
                } else {
                    $status = 'Nunggak';
                }
            } else {
                $status = $setorNominal > 0 ? 'Lunas' : 'Nunggak';
            }

            // Format Riwayat untuk Modal "Buku Catatan Pembayaran"
            $riwayat = $j->setoranHarian->take(15)->map(function ($item) use ($targetHarian) {
                $setor = (float) $item->nominal_setor;
                $sisa = max(0, $targetHarian - $setor);

                return [
                    'id' => $item->id,
                    'kode_transaksi' => $item->kode_transaksi,
                    'tanggal' => Carbon::parse($item->tanggal)->translatedFormat('d M Y'),
                    'raw_tanggal' => Carbon::parse($item->tanggal)->toDateString(),
                    'jam' => $item->jam ? substr($item->jam, 0, 5) : '-',
                    'target' => $targetHarian,
                    'setor' => $setor,
                    'metode_pembayaran' => $item->metode_pembayaran,
                    'keterangan' => $item->keterangan ?: ($setor >= $targetHarian ? 'Setoran Lunas' : 'Setoran Sebagian'),
                    'status' => $setor >= $targetHarian ? 'Lunas' : ($setor > 0 ? 'Kurang' : 'Nunggak'),
                    'sisa_hutang' => $sisa,
                ];
            })->values()->all();

            return [
                'id' => $j->id,
                'kode_jukir' => $j->kode_jukir ?? "JKR-{$j->id}",
                'nama' => $j->nama,
                'titik_parkir' => $j->wilayahParkir->nama_jalan ?? '-',
                'kecamatan' => $j->wilayahParkir->kecamatan->nama_kecamatan ?? '-',
                'kecamatan_id' => $j->wilayahParkir->kecamatan_id ?? null,
                'target_harian' => $targetHarian,
                'target_nominal' => $targetNominal,
                'setor_hari_ini' => $setorNominal,
                'jam_bayar' => $jamBayar ? substr($jamBayar, 0, 5).' WIB' : null,
                'status' => $status,
                'riwayat' => $riwayat,
            ];
        });

        // Filter Status jika dipilih (Lunas / Kurang / Nunggak)
        if ($statusFilter = $request->input('status')) {
            $transformed = $transformed->filter(function ($item) use ($statusFilter) {
                return $item['status'] === $statusFilter;
            })->values();
        }

        // 4. Hitung Kartu Statistik Ringkasan (Realtime dari Database)
        $totalSetorHariIni = (float) JukirSetorHarian::whereDate('tanggal', $today)->where('status', 'Success')->sum('nominal_setor');
        $totalTargetHariIni = (float) JukirTarget::where('tahun', $currentYear)->where('bulan', $currentMonth)->sum('target_per_hari');
        $persentaseHariIni = $totalTargetHariIni > 0 ? round(($totalSetorHariIni / $totalTargetHariIni) * 100) : 0;

        $totalSetorBulanIni = (float) JukirSetorHarian::whereYear('tanggal', $currentYear)->whereMonth('tanggal', $currentMonth)->where('status', 'Success')->sum('nominal_setor');
        $totalTargetBulanIni = (float) JukirTarget::where('tahun', $currentYear)->where('bulan', $currentMonth)->sum('total_target');
        $persentaseBulanIni = $totalTargetBulanIni > 0 ? round(($totalSetorBulanIni / $totalTargetBulanIni) * 100) : 0;

        $totalSetorTahunIni = (float) JukirSetorHarian::whereYear('tanggal', $currentYear)->where('status', 'Success')->sum('nominal_setor');
        $totalTargetTahunIni = (float) JukirTarget::where('tahun', $currentYear)->sum('total_target');
        $persentaseTahunIni = $totalTargetTahunIni > 0 ? round(($totalSetorTahunIni / $totalTargetTahunIni) * 100) : 0;

        $stats = [
            'hariIni' => $totalSetorHariIni,
            'targetHariIni' => $totalTargetHariIni,
            'persentaseHariIni' => $persentaseHariIni,
            'bulanIni' => $totalSetorBulanIni,
            'targetBulanIni' => $totalTargetBulanIni,
            'persentaseBulanIni' => $persentaseBulanIni,
            'tahunIni' => $totalSetorTahunIni,
            'targetTahunIni' => $totalTargetTahunIni,
            'persentaseTahunIni' => $persentaseTahunIni,
        ];

        // 5. Opsi untuk Dropdown Modal Catat Setoran Tunai
        $allJukirOptions = Jukir::query()
            ->with(['wilayahParkir.kecamatan', 'targets' => function ($q) use ($currentYear, $currentMonth) {
                $q->where('tahun', $currentYear)->where('bulan', $currentMonth);
            }])
            ->where('status', 'Aktif')
            ->orderBy('nama', 'asc')
            ->get()
            ->map(function ($j) {
                $target = $j->targets->first();

                return [
                    'id' => $j->id,
                    'nama' => $j->nama,
                    'kode_jukir' => $j->kode_jukir,
                    'target_harian' => $target ? (float) $target->target_per_hari : 0,
                    'titik_parkir' => $j->wilayahParkir->nama_jalan ?? '-',
                    'kecamatan' => $j->wilayahParkir->kecamatan->nama_kecamatan ?? '-',
                ];
            });

        // Hanya ambil kecamatan yang sudah memiliki/berelasi dengan data wilayah parkir
        $kecamatanList = Kecamatan::has('wilayahParkir')->orderBy('nama_kecamatan', 'asc')->get();

        // Response jika via AJAX / JSON (untuk update instan saat filter berubah)
        if ($request->wantsJson()) {
            return response()->json([
                'dataJukir' => $transformed,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Backend/SetoranHarian/Index', [
            'initialDataJukir' => $transformed,
            'stats' => $stats,
            'kecamatanList' => $kecamatanList,
            'allJukirOptions' => $allJukirOptions,
            'filters' => [
                'search' => $request->input('search', ''),
                'kecamatan_id' => $kecamatanId !== null ? (string) $kecamatanId : '',
                'periode' => $periode,
                'start_date' => $request->input('start_date', ''),
                'end_date' => $request->input('end_date', ''),
                'status' => $request->input('status', ''),
            ],
            'defaultKecamatanId' => $defaultKecamatanId,
        ]);
    }

    /**
     * Menyimpan pencatatan setoran tunai manual oleh bendahara UPTD
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jukir_id' => 'required|exists:jukir,id',
            'tanggal' => 'required|date',
            'jam' => 'nullable|string',
            'nominal_setor' => 'required|numeric|min:1000',
            'metode_pembayaran' => 'required|in:Tunai,QRIS',
            'keterangan' => 'nullable|string|max:500',
        ], [
            'jukir_id.required' => 'Juru parkir harus dipilih.',
            'jukir_id.exists' => 'Juru parkir tidak ditemukan.',
            'tanggal.required' => 'Tanggal setoran harus diisi.',
            'nominal_setor.required' => 'Nominal setoran harus diisi.',
            'nominal_setor.min' => 'Nominal setoran minimal Rp 1.000.',
        ]);

        // Ambil data jukir untuk menyematkan kode jukir resmi
        $jukir = Jukir::findOrFail($validated['jukir_id']);
        $kodeJukir = $jukir->kode_jukir ?: "JKR{$jukir->id}";

        // Format tanggal (YYYYMMDD) dan waktu pencatatan (His = JamMenitDetik)
        $dateCode = Carbon::parse($validated['tanggal'])->format('Ymd');
        $now = Carbon::now();
        $jamInput = !empty($validated['jam']) ? $validated['jam'] : $now->format('H:i:s');
        $timeCode = $now->format('His'); // Contoh: 143025

        // Buat Kode Transaksi unik: TRX-YYYYMMDD-KODEJUKIR-HHMMSS
        $kodeTransaksi = "TRX-{$dateCode}-{$kodeJukir}-{$timeCode}";

        // Proteksi duplikasi jika ada transaksi di detik yang persis sama
        if (JukirSetorHarian::where('kode_transaksi', $kodeTransaksi)->exists()) {
            $kodeTransaksi .= '-' . strtoupper(Str::random(2));
        }

        // Simpan ke database
        JukirSetorHarian::create([
            'jukir_id' => $validated['jukir_id'],
            'petugas_id' => Auth::id(),
            'kode_transaksi' => $kodeTransaksi,
            'tanggal' => $validated['tanggal'],
            'jam' => $jamInput,
            'nominal_setor' => $validated['nominal_setor'],
            'metode_pembayaran' => $validated['metode_pembayaran'] ?? 'Tunai',
            'status' => 'Success',
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect()->back()->with('success', "Setoran tunai berhasil dicatat dengan kode [{$kodeTransaksi}].");
    }

    /**
     * Membatalkan transaksi setoran tunai (khusus tunai jika ada salah input)
     */
    public function destroy($id)
    {
        $setoran = JukirSetorHarian::findOrFail($id);

        if ($setoran->metode_pembayaran === 'QRIS') {
            return redirect()->back()->with('error', 'Transaksi QRIS tidak dapat dihapus secara manual demi integritas data.');
        }

        $setoran->delete();

        return redirect()->back()->with('success', 'Transaksi setoran berhasil dibatalkan.');
    }
}
