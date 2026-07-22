<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GaleriFoto;

class GaleriFotoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'kategori' => 'Penertiban',
                'caption' => 'Penertiban jukir tidak berseragam di Alun-alun Singaparna',
                'tanggal' => '2026-07-18',
                'foto' => 'galeri/penertiban-singaparna.jpg',
            ],
            [
                'kategori' => 'Penertiban',
                'caption' => 'Razia gabungan titik parkir liar Jl. Raya Rajapolah',
                'tanggal' => '2026-07-10',
                'foto' => 'galeri/razia-rajapolah.jpg',
            ],
            [
                'kategori' => 'Pembinaan',
                'caption' => 'Pembinaan atribut dan etika juru parkir binaan UPTD',
                'tanggal' => '2026-07-05',
                'foto' => 'galeri/pembinaan-jukir.jpg',
            ],
            [
                'kategori' => 'Pembinaan',
                'caption' => 'Sosialisasi tarif resmi kepada jukir wilayah Manonjaya',
                'tanggal' => '2026-06-28',
                'foto' => 'galeri/sosialisasi-manonjaya.jpg',
            ],
            [
                'kategori' => 'Penertiban',
                'caption' => 'Penindakan tarif getok di kawasan Terminal Singaparna',
                'tanggal' => '2026-06-20',
                'foto' => 'galeri/penindakan-terminal.jpg',
            ],
            [
                'kategori' => 'Pembinaan',
                'caption' => 'Pembagian atribut rompi & ID Card baru untuk jukir',
                'tanggal' => '2026-06-12',
                'foto' => 'galeri/pembagian-atribut.jpg',
            ],
        ];

        foreach ($items as $item) {
            GaleriFoto::updateOrCreate(
                ['caption' => $item['caption']],
                $item
            );
        }
    }
}
