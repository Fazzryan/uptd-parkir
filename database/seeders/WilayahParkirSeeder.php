<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WilayahParkir;
use App\Models\Kecamatan;

class WilayahParkirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataWilayah = [
            [
                'kecamatan' => 'Singaparna',
                'nama_jalan' => 'Jl. Raya Singaparna No. 45',
                'latitude' => '-7.352400',
                'longitude' => '108.112300',
            ],
            [
                'kecamatan' => 'Ciawi',
                'nama_jalan' => 'Jl. Raya Ciawi Pasar Baru',
                'latitude' => '-7.154200',
                'longitude' => '108.134500',
            ],
            [
                'kecamatan' => 'Rajapolah',
                'nama_jalan' => 'Jl. Kerajinan Rajapolah',
                'latitude' => '-7.218500',
                'longitude' => '108.193200',
            ],
            [
                'kecamatan' => 'Taraju',
                'nama_jalan' => 'Jl. Raya Taraju Pusat Usaha',
                'latitude' => '-7.459600',
                'longitude' => '107.982300',
            ],
            [
                'kecamatan' => 'Tanjungjaya',
                'nama_jalan' => 'Jl. Cibeureum Tanjungjaya',
                'latitude' => '-7.389200',
                'longitude' => '108.121800',
            ],
            [
                'kecamatan' => 'Karangnunggal',
                'nama_jalan' => 'Jl. Raya Karangnunggal Pasar',
                'latitude' => '-7.632100',
                'longitude' => '108.145200',
            ],
            [
                'kecamatan' => 'Cipatujah',
                'nama_jalan' => 'Jl. Pesisir Cipatujah',
                'latitude' => '-7.745600',
                'longitude' => '108.012400',
            ],
            [
                'kecamatan' => 'Manonjaya',
                'nama_jalan' => 'Jl. Alun-Alun Manonjaya',
                'latitude' => '-7.351200',
                'longitude' => '108.274100',
            ],
            [
                'kecamatan' => 'Cisayong',
                'nama_jalan' => 'Jl. Stasiun Cisayong',
                'latitude' => '-7.265400',
                'longitude' => '108.163200',
            ],
            [
                'kecamatan' => 'Salawu',
                'nama_jalan' => 'Jl. Raya Salawu Garut',
                'latitude' => '-7.391200',
                'longitude' => '108.024500',
            ],
            [
                'kecamatan' => 'Cikalong',
                'nama_jalan' => 'Jl. Pantai Cikalong',
                'latitude' => '-7.684500',
                'longitude' => '108.223400',
            ],
            [
                'kecamatan' => 'Bantarkalong',
                'nama_jalan' => 'Jl. Simpang Bantarkalong',
                'latitude' => '-7.592300',
                'longitude' => '108.115400',
            ],
            [
                'kecamatan' => 'Jamanis',
                'nama_jalan' => 'Jl. Raya Jamanis Utara',
                'latitude' => '-7.194200',
                'longitude' => '108.172300',
            ],
            [
                'kecamatan' => 'Sukaraja',
                'nama_jalan' => 'Jl. Raya Sukaraja Pasar',
                'latitude' => '-7.398500',
                'longitude' => '108.214500',
            ],
            [
                'kecamatan' => 'Leuwisari',
                'nama_jalan' => 'Jl. Wisata Galunggung Leuwisari',
                'latitude' => '-7.332100',
                'longitude' => '108.094500',
            ],
        ];

        foreach ($dataWilayah as $item) {
            $kecamatanModel = Kecamatan::where('nama_kecamatan', $item['kecamatan'])->first();
            $kecamatanId = $kecamatanModel ? $kecamatanModel->id : null;

            WilayahParkir::updateOrCreate(
                [
                    'nama_jalan' => $item['nama_jalan'],
                ],
                [
                    'kecamatan_id' => $kecamatanId,
                    'nama_jalan' => $item['nama_jalan'],
                    'latitude' => $item['latitude'],
                    'longitude' => $item['longitude'],
                ]
            );
        }
    }
}
