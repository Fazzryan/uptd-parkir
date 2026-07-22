<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PanduanJukir;

class PanduanJukirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'teks_info' => 'Rompi Resmi',
                'deskripsi' => 'Rompi keselamatan warna oranye dengan garis reflektif dan identitas UPTD, agar petugas mudah terlihat di jalan.',
                'foto' => 'panduan-jukir/rompi-resmi.png',
            ],
            [
                'teks_info' => 'Topi Dinas',
                'deskripsi' => 'Topi/peci seragam resmi sebagai bagian dari atribut kerja juru parkir binaan UPTD.',
                'foto' => 'panduan-jukir/topi-dinas.png',
            ],
            [
                'teks_info' => 'ID Card',
                'deskripsi' => 'Kartu identitas resmi berlogo Pemkab Tasikmalaya, mencantumkan nama dan nomor registrasi petugas.',
                'foto' => 'panduan-jukir/id-card.png',
            ],
            [
                'teks_info' => 'Peluit',
                'deskripsi' => 'Alat bantu resmi untuk mengatur arus kendaraan keluar-masuk di titik parkir.',
                'foto' => 'panduan-jukir/peluit.png',
            ],
        ];

        foreach ($items as $item) {
            PanduanJukir::updateOrCreate(
                ['teks_info' => $item['teks_info']],
                $item
            );
        }
    }
}
