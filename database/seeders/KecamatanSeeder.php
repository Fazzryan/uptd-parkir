<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Kecamatan;
use Illuminate\Support\Facades\Log;

class KecamatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $response = Http::withHeaders([
                'X-API-GEOTASIK' => 'TasikMaju2025$%^&',
                'Accept' => 'application/json',
            ])
            ->withoutVerifying()
            ->timeout(15)
            ->get('https://geotasik.tasikmalayakab.go.id/api/kecamatan');

            if ($response->successful() && isset($response->json()['data'])) {
                $items = $response->json()['data'];
                foreach ($items as $item) {
                    Kecamatan::updateOrCreate(
                        ['id_kecamatan' => (string) ($item['id_kecamatan'] ?? $item['id'])],
                        [
                            'nama_kecamatan' => $item['nama_kecamatan'],
                            'latitude'       => $item['latitude'] ?? null,
                            'longitude'      => $item['longitude'] ?? null,
                            'alamat'         => $item['alamat'] ?? null,
                        ]
                    );
                }
                $this->command->info('Berhasil menarik ' . count($items) . ' data kecamatan dari API Geotasik.');
                return;
            }
        } catch (\Exception $e) {
            Log::warning('Gagal terhubung ke API Geotasik, menggunakan fallback data lokal: ' . $e->getMessage());
        }

        // Fallback jika API sedang tidak dapat diakses
        $fallbackKecamatan = [
            'Bantarkalong', 'Bojongasih', 'Bojonggambir', 'Ciawi', 'Cibalong',
            'Cigalontang', 'Cikalong', 'Cikatomas', 'Cineam', 'Cipatujah',
            'Cisayong', 'Culamega', 'Gunungtanjung', 'Jamanis', 'Jatiwaras',
            'Kadipaten', 'Karangjaya', 'Karangnunggal', 'Leuwisari', 'Manonjaya',
            'Padakembang', 'Pageurageung', 'Pancatengah', 'Parungponteng', 'Puspahiang',
            'Rajapolah', 'Salawu', 'Salopa', 'Singaparna', 'Sukaraja',
            'Sukarame', 'Sukaratu', 'Sukaresik', 'Tanjungjaya', 'Taraju'
        ];

        foreach ($fallbackKecamatan as $idx => $nama) {
            Kecamatan::updateOrCreate(
                ['nama_kecamatan' => $nama],
                [
                    'id_kecamatan' => '3206' . str_pad((string)($idx + 1), 3, '0', STR_PAD_LEFT),
                ]
            );
        }
        $this->command->info('Menggunakan fallback data master kecamatan lokal (' . count($fallbackKecamatan) . ' kecamatan).');
    }
}
