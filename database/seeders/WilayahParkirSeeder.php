<?php

namespace Database\Seeders;

use App\Models\Kecamatan;
use App\Models\WilayahParkir;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;

class WilayahParkirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Mengisi data titik lokasi wilayah parkir resmi berdasarkan file referensi Excel DATA QRIES JUKIR.
     */
    public function run(): void
    {
        $filePath = base_path('referensi/DATA QRIES JUKIR.xlsx');

        if (! file_exists($filePath)) {
            $this->command->error("File referensi Excel tidak ditemukan di: {$filePath}");

            return;
        }

        $spreadsheet = IOFactory::load($filePath);

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

        $totalTitik = 0;

        foreach ($sheetMapping as $sheetName => $kecName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            if (! $sheet) {
                continue;
            }

            $kecamatan = Kecamatan::where('nama_kecamatan', 'like', "%{$kecName}%")->first();
            if (! $kecamatan) {
                continue;
            }

            $rows = $sheet->toArray(null, true, true, true);
            $lastLokasi = '';
            $titikInSheet = 0;

            foreach ($rows as $r) {
                $colA = trim((string) ($r['A'] ?? ''));
                $colB = trim((string) ($r['B'] ?? ''));
                $colC = trim((string) ($r['C'] ?? ''));
                $colE = trim((string) ($r['E'] ?? ''));

                if (empty($colB) && empty($colC) && empty($colE)) {
                    continue;
                }

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

                $upperA = strtoupper($colA);
                if (str_contains($upperA, 'JUMLAH') || str_contains($upperA, 'TOTAL')) {
                    continue;
                }

                // Sub-header lokasi (misal "PASAR KIDUL")
                if (empty($colB) && ! empty($colC) && empty($colE)) {
                    $lastLokasi = $colC;

                    continue;
                }

                if (! empty($colB)) {
                    $lokasi = ! empty($colC) ? $colC : $lastLokasi;
                    if (! empty($colC)) {
                        $lastLokasi = $colC;
                    }
                    if (empty($lokasi)) {
                        $lokasi = 'Wilayah '.$kecName;
                    }

                    $lokasiClean = trim($lokasi);

                    // Buat atau update titik wilayah parkir secara unik
                    $created = WilayahParkir::firstOrCreate(
                        [
                            'kecamatan_id' => $kecamatan->id,
                            'nama_jalan' => $lokasiClean,
                        ],
                        [
                            'latitude' => $kecamatan->latitude,
                            'longitude' => $kecamatan->longitude,
                        ]
                    );

                    if ($created->wasRecentlyCreated) {
                        $titikInSheet++;
                        $totalTitik++;
                    }
                }
            }

            $this->command->info("Kecamatan {$kecName}: Berhasil mensinkronkan titik lokasi parkir.");
        }

        $this->command->info('SUKSES: Total titik lokasi wilayah parkir resmi sesuai Excel tersimpan.');
    }
}
