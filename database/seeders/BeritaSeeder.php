<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'judul' => 'Penertiban jukir tidak berseragam di kawasan Alun-alun Singaparna',
                'slug' => 'penertiban-jukir-tidak-berseragam-singaparna',
                'kategori' => 'Penertiban',
                'tanggal' => '2026-07-18',
                'ringkasan' => 'UPTD bersama petugas gabungan menindak jukir yang tidak memakai atribut resmi.',
                'isi' => 'Petugas UPTD Pengelola Parkir Dishubkominfo Kabupaten Tasikmalaya menggelar operasi penertiban juru parkir di kawasan Alun-alun Singaparna. Penertiban ini menyasar petugas parkir yang tidak mengenakan atribut resmi seperti rompi dan ID Card.',
                'foto' => 'berita/penertiban-singaparna.jpg',
            ],
            [
                'judul' => 'Update tarif parkir sepeda motor sesuai Perbup terbaru',
                'slug' => 'update-tarif-parkir-sepeda-motor-perbup',
                'kategori' => 'Pengumuman',
                'tanggal' => '2026-07-12',
                'ringkasan' => 'Penyesuaian tarif resmi berlaku efektif mulai awal bulan berikutnya.',
                'isi' => 'UPTD Pengelola Parkir mengumumkan sosialisasi penyesuaian tarif retribusi parkir tepi jalan umum berdasarkan Peraturan Bupati Tasikmalaya yang terbaru. Tarif untuk sepeda motor ditetapkan sebesar Rp 2.000 per sekali parkir.',
                'foto' => 'berita/update-tarif.jpg',
            ],
            [
                'judul' => 'Pembinaan rutin dan pembagian rompi reflektif untuk jukir binaan',
                'slug' => 'pembinaan-rutin-dan-pembagian-rompi-reflektif',
                'kategori' => 'Sosialisasi',
                'tanggal' => '2026-07-05',
                'ringkasan' => 'Meningkatkan keselamatan kerja dan kepatuhan standar pelayanan jukir.',
                'isi' => 'Sebanyak 50 juru parkir binaan UPTD mengikuti kegiatan pembinaan etika pelayanan publik dan menerima kelengkapan rompi reflektif serta kartu identitas (ID Card) baru.',
                'foto' => 'berita/pembinaan-rompi.jpg',
            ],
        ];

        foreach ($items as $item) {
            Berita::updateOrCreate(
                ['judul' => $item['judul']],
                $item
            );
        }
    }
}
