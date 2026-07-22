<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TarifParkirKarcis;

class TarifParkirKarcisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'kategori_kendaraan' => 'Sepeda Motor (Roda 2)',
                'nominal_tarif' => 2000,
                'keterangan' => '/ sekali parkir',
                'foto' => 'tarif-parkir/karcis-motor.png',
            ],
            [
                'kategori_kendaraan' => 'Mobil (Roda 4)',
                'nominal_tarif' => 3000,
                'keterangan' => '/ sekali parkir',
                'foto' => 'tarif-parkir/karcis-mobil.png',
            ],
            [
                'kategori_kendaraan' => 'Bus / Truk',
                'nominal_tarif' => 5000,
                'keterangan' => '/ sekali parkir',
                'foto' => 'tarif-parkir/karcis-bus.png',
            ],
        ];

        foreach ($items as $item) {
            TarifParkirKarcis::updateOrCreate(
                ['kategori_kendaraan' => $item['kategori_kendaraan']],
                $item
            );
        }
    }
}
