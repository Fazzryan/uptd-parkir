<?php

namespace Database\Seeders;

use App\Models\Jukir;
use App\Models\JukirTarget;
use App\Models\Kecamatan;
use App\Models\User;
use App\Models\WilayahParkir;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;

class JukirSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk mengisi data Juru Parkir dari dokumen Excel referensi.
     */
    public function run(): void
    {
        $filePath = base_path('referensi/DATA QRIES JUKIR.xlsx');

        if (! file_exists($filePath)) {
            $this->command->error("File referensi Excel tidak ditemukan di: {$filePath}");

            return;
        }

        $spreadsheet = IOFactory::load($filePath);

        // Mapping nama sheet pada Excel ke nama kecamatan di tabel 'kecamatans'
        $sheetMapping = [
            'SINGAPRNA' => 'Singaparna',
            'CIAWI' => 'Ciawi',
            'MANNJAYA' => 'Manonjaya',
            'RAJAPOLAH' => 'Rajapolah',
            'CINEAM' => 'Cineam',
            'SKRJ' => 'Sukaraja',
            'KRGNGGL' => 'Karangnunggal',
            'BTRKLG' => 'Bantarkalong',
            'CPTJH' => 'Cipatujah',
            'CIKATOMAS' => 'Cikatomas',
            'TARAJU' => 'Taraju',
            'BJGGMBIR' => 'Bojonggambir',
            'PUSPAHIANG' => 'Puspahiang',
        ];

        $usernames = [];
        $totalJukir = 0;
        $tahun = 2026;

        DB::beginTransaction();

        try {
            foreach ($sheetMapping as $sheetName => $kecName) {
                $sheet = $spreadsheet->getSheetByName($sheetName);
                if (! $sheet) {
                    $this->command->warn("Sheet [{$sheetName}] tidak ditemukan di Excel, melewati...");

                    continue;
                }

                // Cari data kecamatan di database
                $kecamatan = Kecamatan::where('nama_kecamatan', 'like', "%{$kecName}%")->first();
                if (! $kecamatan) {
                    $this->command->warn("Data Kecamatan [{$kecName}] tidak ditemukan di tabel kecamatans, melewati...");

                    continue;
                }

                $rows = $sheet->toArray(null, true, true, true);
                $lastLokasi = '';
                $jukirInSheet = 0;

                foreach ($rows as $rowIndex => $r) {
                    $colA = trim((string) ($r['A'] ?? ''));
                    $colB = trim((string) ($r['B'] ?? ''));
                    $colC = trim((string) ($r['C'] ?? ''));
                    $colD = trim((string) ($r['D'] ?? ''));
                    $colE = trim((string) ($r['E'] ?? ''));
                    $colF = trim((string) ($r['F'] ?? ''));

                    // Lewati baris kosong
                    if (empty($colB) && empty($colC) && empty($colE)) {
                        continue;
                    }

                    // Filter teks header/total di kolom B
                    $upperB = strtoupper($colB);
                    if (
                        $upperB === 'NAMA' ||
                        $upperB === '2' ||
                        str_contains($upperB, 'REALISASI') ||
                        str_contains($upperB, 'SETORAN') ||
                        str_contains($upperB, 'JUMLAH') ||
                        str_contains($upperB, 'TOTAL')
                    ) {
                        continue;
                    }

                    // Lewati baris jumlah/total di kolom A
                    $upperA = strtoupper($colA);
                    if (str_contains($upperA, 'JUMLAH') || str_contains($upperA, 'TOTAL')) {
                        continue;
                    }

                    // Baris sub-header wilayah (contoh: "PASAR KIDUL")
                    if (empty($colB) && ! empty($colC) && empty($colE)) {
                        $lastLokasi = $colC;

                        continue;
                    }

                    // Baris yang memiliki nama jukir
                    if (! empty($colB)) {
                        // Tentukan titik penugasan jukir
                        $lokasi = ! empty($colC) ? $colC : $lastLokasi;
                        if (! empty($colC)) {
                            $lastLokasi = $colC;
                        }
                        if (empty($lokasi)) {
                            $lokasi = 'Wilayah '.$kecName;
                        }

                        // Bersihkan nominal target per hari
                        $targetRaw = preg_replace('/[^0-9]/', '', $colE);
                        $targetPerHari = $targetRaw !== '' ? (float) $targetRaw : 0;

                        // Bersihkan jumlah hari kerja per bulan (default 26 jika kosong/0)
                        $hariRaw = preg_replace('/[^0-9]/', '', $colD);
                        $jmlHari = $hariRaw !== '' ? (int) $hariRaw : 26;
                        if ($jmlHari <= 0) {
                            $jmlHari = 26;
                        }

                        // 1. Dapatkan atau Buat Titik Wilayah Parkir
                        $wilayahParkir = WilayahParkir::firstOrCreate(
                            [
                                'kecamatan_id' => $kecamatan->id,
                                'nama_jalan' => $lokasi,
                            ],
                            [
                                'latitude' => $kecamatan->latitude,
                                'longitude' => $kecamatan->longitude,
                            ]
                        );

                        $namaJukir = Str::title($colB);

                        // Cek apakah Jukir pada titik penugasan ini sudah ada di database
                        $existingJukir = Jukir::where('nama', $namaJukir)
                            ->where('wilayah_parkir_id', $wilayahParkir->id)
                            ->first();

                        if ($existingJukir) {
                            // Data sudah ada dari seeding sebelumnya, lewati agar tidak menduplikasi
                            continue;
                        }

                        // Generate username unik jukir
                        $baseSlug = Str::slug($colB, '_');
                        if (empty($baseSlug)) {
                            $baseSlug = 'jukir';
                        }
                        $username = 'jukir_'.$baseSlug;
                        $counter = 1;
                        while (isset($usernames[$username]) || User::where('username', $username)->exists()) {
                            $username = 'jukir_'.$baseSlug.'_'.$counter;
                            $counter++;
                        }
                        $usernames[$username] = true;

                        // 2. Buat Akun Pengguna untuk Juru Parkir
                        $user = User::firstOrCreate(
                            ['username' => $username],
                            [
                                'name' => $namaJukir,
                                'email' => "{$username}.uptdparkir@gmail.com",
                                'password' => Hash::make('password123'),
                            ]
                        );
                        $user->assignRole('jukir');

                        // 3. Buat Profil Juru Parkir (Format: 4HURUF_WILAYAH-NAMA-4RANDOM)
                        $kodeKecMap = [
                            'Singaparna' => 'SGPR',
                            'Ciawi' => 'CIAW',
                            'Manonjaya' => 'MNJY',
                            'Rajapolah' => 'RJPL',
                            'Cineam' => 'CNEM',
                            'Sukaraja' => 'SKRJ',
                            'Karangnunggal' => 'KRNG',
                            'Bantarkalong' => 'BTKL',
                            'Cipatujah' => 'CPTJ',
                            'Cikatomas' => 'CKTM',
                            'Taraju' => 'TRJU',
                            'Bojonggambir' => 'BJGB',
                            'Puspahiang' => 'PSPH',
                        ];
                        $kodeKec = $kodeKecMap[$kecName] ?? strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $kecName), 0, 4));
                        $firstWord = explode(' ', trim($colB))[0] ?? 'JUKIR';
                        $namaClean = substr(preg_replace('/[^A-Z]/', '', strtoupper($firstWord)), 0, 6) ?: 'JUKIR';
                        do {
                            $randomStr = strtoupper(Str::random(4));
                            $kodeJukir = "{$kodeKec}-{$namaClean}-{$randomStr}";
                        } while (Jukir::where('kode_jukir', $kodeJukir)->exists());

                        $nohp = '08'.mt_rand(11, 99).mt_rand(1000000, 9999999);

                        $jukir = Jukir::firstOrCreate(
                            ['user_id' => $user->id],
                            [
                                'wilayah_parkir_id' => $wilayahParkir->id,
                                'kode_jukir' => $kodeJukir,
                                'nama' => $namaJukir,
                                'nohp' => $nohp,
                                'alamat' => "Kecamatan {$kecName}, Kab. Tasikmalaya",
                                'foto' => 'assets/images/dump.jpg',
                                'status' => 'Aktif',
                            ]
                        );

                        // 4. Generate Target Retribusi Bulanan (12 Bulan untuk Tahun 2026)
                        $totalTarget = $targetPerHari * $jmlHari;
                        $keterangan = ! empty($colF) ? trim($colF) : null;

                        for ($bulan = 1; $bulan <= 12; $bulan++) {
                            JukirTarget::firstOrCreate(
                                [
                                    'jukir_id' => $jukir->id,
                                    'tahun' => $tahun,
                                    'bulan' => $bulan,
                                ],
                                [
                                    'jml_hari' => $jmlHari,
                                    'target_per_hari' => $targetPerHari,
                                    'total_target' => $totalTarget,
                                    'keterangan' => $keterangan,
                                ]
                            );
                        }

                        $jukirInSheet++;
                        $totalJukir++;
                    }
                }

                $this->command->info("Kecamatan {$kecName} ({$sheetName}): Berhasil memproses {$jukirInSheet} juru parkir.");
            }

            DB::commit();
            $this->command->info("SUKSES: Total {$totalJukir} data juru parkir beserta titik lokasi dan target 12 bulan berhasil di-seed!");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Gagal menjalankan JukirSeeder: '.$e->getMessage());
        }
    }
}
