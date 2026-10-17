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

        // 1. Ambil seluruh setoran sukses jukir pada bulan berjalan untuk audit per tanggal
        $monthlyDeposits = $jukir->setoranHarian()
            ->whereYear('tanggal', $currentYear)
            ->whereMonth('tanggal', $currentMonth)
            ->where('status', 'Success')
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->tanggal)->format('Y-m-d');
            });

        // 2. Susun rekap harian dari tanggal 1 sampai hari ini (otomatis berbahasa Indonesia via config app.locale)
        $currentDay = (int) date('j');
        $dailyAudit = [];
        $totalTunggakanBulanIni = 0;
        $hariNunggakCount = 0;
        $hariKurangCount = 0;
        $hariLunasCount = 0;

        for ($d = 1; $d <= $currentDay; $d++) {
            $dateCarbon = Carbon::createFromDate($currentYear, $currentMonth, $d);
            $dateStr = $dateCarbon->format('Y-m-d');

            $depositsOnDate = $monthlyDeposits->get($dateStr, collect());
            $totalSetorOnDate = (float) $depositsOnDate->sum('nominal_setor');
            $trxCount = $depositsOnDate->count();
            $kurangOnDate = max(0, $targetHarian - $totalSetorOnDate);

            if ($targetHarian > 0) {
                if ($totalSetorOnDate >= $targetHarian) {
                    $statusOnDate = 'Lunas';
                    $hariLunasCount++;
                } elseif ($totalSetorOnDate > 0) {
                    $statusOnDate = 'Kurang';
                    $hariKurangCount++;
                    $totalTunggakanBulanIni += $kurangOnDate;
                } else {
                    $statusOnDate = 'Nunggak';
                    $hariNunggakCount++;
                    $totalTunggakanBulanIni += $kurangOnDate;
                }
            } else {
                $statusOnDate = $totalSetorOnDate > 0 ? 'Lunas' : 'Nunggak';
            }

            $dailyAudit[] = [
                'tanggal' => $dateStr,
                'hari' => $dateCarbon->translatedFormat('l'),
                'formatted_tanggal' => $dateCarbon->translatedFormat('l, d F Y'),
                'short_tanggal' => $dateCarbon->translatedFormat('d M Y'),
                'is_today' => $dateStr === $today,
                'target' => $targetHarian,
                'setor' => $totalSetorOnDate,
                'kurang' => $kurangOnDate,
                'status' => $statusOnDate,
                'trx_count' => $trxCount,
            ];
        }

        // Urutkan dari tanggal terbaru ke tanggal 1
        $dailyAuditDesc = array_reverse($dailyAudit);

        // 3. Ringkasan Statistik Finansial Jukir Ini
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
            'totalTunggakanBulanIni' => $totalTunggakanBulanIni,
            'hariLunasCount' => $hariLunasCount,
            'hariKurangCount' => $hariKurangCount,
            'hariNunggakCount' => $hariNunggakCount,
            'totalHariBerjalan' => $currentDay,
            'totalSemuaSetor' => $totalSemuaSetor,
            'totalTunai' => $totalTunai,
            'totalQRIS' => $totalQRIS,
            'namaBulan' => Carbon::now()->translatedFormat('F Y'),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'riwayat' => $riwayat,
                'stats' => $stats,
                'dailyAudit' => $dailyAuditDesc,
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
            'dailyAudit' => $dailyAuditDesc,
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

        // 2. Filter Kecamatan (Default ke Kecamatan Singaparna jika pertama kali dibuka tanpa query param)
        $singaparna = Kecamatan::where('nama_kecamatan', 'like', '%Singaparna%')->first();
        $defaultKecamatanId = $singaparna ? (string) $singaparna->id : '';

        // Jika request memiliki parameter kecamatan_id (termasuk "" jika user pilih "Semua Kecamatan"):
        if ($request->has('kecamatan_id')) {
            $kecamatanId = $request->input('kecamatan_id');
        } else {
            // Pertama kali buka halaman: gunakan Singaparna sebagai default
            $kecamatanId = $defaultKecamatanId;
        }

        // 3. Query Juru Parkir pada Wilayah Terpilih
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

        // Terapkan filter wilayah/kecamatan jika dipilih
        if ($kecamatanId) {
            $query->whereHas('wilayahParkir', function ($w) use ($kecamatanId) {
                $w->where('kecamatan_id', $kecamatanId);
            });
        }

        // Ambil data jukir pada wilayah tersebut
        $wilayahJukirCollection = $query->orderBy('nama', 'asc')->get();

        // 4. Transformasi Data Jukir & Hitung Target, Realisasi, Tunggakan, dan Status
        $transformed = $wilayahJukirCollection->map(function ($j) use ($periode, $startDate, $endDate) {
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

            $persentase = $targetNominal > 0 ? round(($setorNominal / $targetNominal) * 100) : 0;
            $tunggakanNominal = max(0, $targetNominal - $setorNominal);

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
                'foto' => $j->foto,
                'nohp' => $j->nohp,
                'titik_parkir' => $j->wilayahParkir->nama_jalan ?? '-',
                'kecamatan' => $j->wilayahParkir->kecamatan->nama_kecamatan ?? '-',
                'kecamatan_id' => $j->wilayahParkir->kecamatan_id ?? null,
                'target_harian' => $targetHarian,
                'target_nominal' => $targetNominal,
                'setor_hari_ini' => $setorNominal,
                'setor_nominal' => $setorNominal,
                'tunggakan_nominal' => $tunggakanNominal,
                'persentase' => $persentase,
                'jam_bayar' => $jamBayar ? substr($jamBayar, 0, 5).' WIB' : null,
                'status' => $status,
                'riwayat' => $riwayat,
            ];
        });

        // 5. Hitung Kartu Statistik Ringkasan (Realtime sesuai Wilayah/Kecamatan yang dipilih)
        $setorHariIniQuery = JukirSetorHarian::whereDate('tanggal', $today)->where('status', 'Success');
        $targetHariIniQuery = JukirTarget::where('tahun', $currentYear)->where('bulan', $currentMonth);

        $setorBulanIniQuery = JukirSetorHarian::whereYear('tanggal', $currentYear)->whereMonth('tanggal', $currentMonth)->where('status', 'Success');
        $targetBulanIniQuery = JukirTarget::where('tahun', $currentYear)->where('bulan', $currentMonth);

        $setorTahunIniQuery = JukirSetorHarian::whereYear('tanggal', $currentYear)->where('status', 'Success');
        $targetTahunIniQuery = JukirTarget::where('tahun', $currentYear);

        // Filter berdasarkan kecamatan jika dipilih
        if ($kecamatanId) {
            $filterKecamatan = function ($q) use ($kecamatanId) {
                $q->whereHas('wilayahParkir', function ($w) use ($kecamatanId) {
                    $w->where('kecamatan_id', $kecamatanId);
                });
            };

            $setorHariIniQuery->whereHas('jukir', $filterKecamatan);
            $targetHariIniQuery->whereHas('jukir', $filterKecamatan);

            $setorBulanIniQuery->whereHas('jukir', $filterKecamatan);
            $targetBulanIniQuery->whereHas('jukir', $filterKecamatan);

            $setorTahunIniQuery->whereHas('jukir', $filterKecamatan);
            $targetTahunIniQuery->whereHas('jukir', $filterKecamatan);
        }

        $totalSetorHariIni = (float) $setorHariIniQuery->sum('nominal_setor');
        $totalTargetHariIni = (float) $targetHariIniQuery->sum('target_per_hari');
        $persentaseHariIni = $totalTargetHariIni > 0 ? round(($totalSetorHariIni / $totalTargetHariIni) * 100) : 0;

        $totalSetorBulanIni = (float) $setorBulanIniQuery->sum('nominal_setor');
        $totalTargetBulanIni = (float) $targetBulanIniQuery->sum('total_target');
        $persentaseBulanIni = $totalTargetBulanIni > 0 ? round(($totalSetorBulanIni / $totalTargetBulanIni) * 100) : 0;

        $totalSetorTahunIni = (float) $setorTahunIniQuery->sum('nominal_setor');
        $totalTargetTahunIni = (float) $targetTahunIniQuery->sum('total_target');
        $persentaseTahunIni = $totalTargetTahunIni > 0 ? round(($totalSetorTahunIni / $totalTargetTahunIni) * 100) : 0;

        // Total Tunggakan (Total kekurangan setoran pada wilayah yang dipilih)
        $totalTunggakan = (float) $transformed->sum('tunggakan_nominal');
        $jumlahJukirNunggak = $transformed->where('tunggakan_nominal', '>', 0)->count();
        $totalJukirWilayah = $transformed->count();

        $selectedKecamatanObj = $kecamatanId ? Kecamatan::find($kecamatanId) : null;
        $namaWilayah = $selectedKecamatanObj ? "Kec. {$selectedKecamatanObj->nama_kecamatan}" : 'Semua Wilayah';

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
            'totalTunggakan' => $totalTunggakan,
            'jumlahJukirNunggak' => $jumlahJukirNunggak,
            'totalJukirWilayah' => $totalJukirWilayah,
            'namaWilayah' => $namaWilayah,
        ];

        // 6. Ambil Top 3 Jukir Terdisiplin (Kepatuhan tertinggi / Lunas / Setoran Tertinggi)
        $topDisiplin = $transformed
            ->filter(fn($item) => $item['setor_nominal'] > 0)
            ->sortByDesc(function ($item) {
                $score = ($item['status'] === 'Lunas' ? 1000000 : 0)
                       + ($item['persentase'] * 1000)
                       + $item['setor_nominal'];
                return $score;
            })
            ->values()
            ->take(3)
            ->map(function ($item, $index) {
                return [
                    'rank' => $index + 1,
                    'id' => $item['id'],
                    'kode_jukir' => $item['kode_jukir'],
                    'nama' => $item['nama'],
                    'foto' => $item['foto'],
                    'nohp' => $item['nohp'],
                    'titik_parkir' => $item['titik_parkir'],
                    'kecamatan' => $item['kecamatan'],
                    'target_nominal' => $item['target_nominal'],
                    'setor_nominal' => $item['setor_nominal'],
                    'tunggakan_nominal' => $item['tunggakan_nominal'],
                    'persentase' => $item['persentase'],
                    'status' => $item['status'],
                    'jam_bayar' => $item['jam_bayar'],
                ];
            })
            ->all();

        // 7. Ambil Top 3 Jukir Perlu Perhatian (Tunggakan/Kekurangan terbesar)
        $topPerhatian = $transformed
            ->filter(fn($item) => $item['tunggakan_nominal'] > 0 || $item['status'] === 'Nunggak')
            ->sortByDesc(function ($item) {
                return $item['tunggakan_nominal'];
            })
            ->values()
            ->take(3)
            ->map(function ($item, $index) {
                return [
                    'rank' => $index + 1,
                    'id' => $item['id'],
                    'kode_jukir' => $item['kode_jukir'],
                    'nama' => $item['nama'],
                    'foto' => $item['foto'],
                    'nohp' => $item['nohp'],
                    'titik_parkir' => $item['titik_parkir'],
                    'kecamatan' => $item['kecamatan'],
                    'target_nominal' => $item['target_nominal'],
                    'setor_nominal' => $item['setor_nominal'],
                    'tunggakan_nominal' => $item['tunggakan_nominal'],
                    'persentase' => $item['persentase'],
                    'status' => $item['status'],
                    'jam_bayar' => $item['jam_bayar'],
                ];
            })
            ->all();

        // 8. Filter Data untuk Tabel (berdasarkan Pencarian Search & Status)
        $tableData = $transformed;

        if ($statusFilter = $request->input('status')) {
            $tableData = $tableData->filter(fn($item) => $item['status'] === $statusFilter);
        }

        if ($search = $request->input('search')) {
            $searchLower = strtolower($search);
            $tableData = $tableData->filter(function ($item) use ($searchLower) {
                return str_contains(strtolower($item['nama']), $searchLower)
                    || str_contains(strtolower($item['kode_jukir']), $searchLower)
                    || str_contains(strtolower($item['titik_parkir']), $searchLower)
                    || str_contains(strtolower($item['kecamatan']), $searchLower);
            });
        }

        $tableData = $tableData->values();

        // 9. Opsi untuk Dropdown Modal Catat Setoran Tunai
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
                'dataJukir' => $tableData,
                'stats' => $stats,
                'topDisiplin' => $topDisiplin,
                'topPerhatian' => $topPerhatian,
            ]);
        }

        return Inertia::render('Backend/SetoranHarian/Index', [
            'initialDataJukir' => $tableData,
            'stats' => $stats,
            'topDisiplin' => $topDisiplin,
            'topPerhatian' => $topPerhatian,
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
