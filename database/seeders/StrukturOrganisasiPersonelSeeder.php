<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StrukturOrganisasiPersonel;

class StrukturOrganisasiPersonelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $personel = [
            [
                'nama' => 'Drs. H. Ahmad Fauzi, M.Si',
                'jabatan' => 'Kepala UPTD Pengelola Parkir',
                'nip' => '197503121998031002',
                'foto' => null,
            ],
            [
                'nama' => 'Budi Santoso, S.STP',
                'jabatan' => 'Kasubag Tata Usaha UPTD',
                'nip' => '198205142006041005',
                'foto' => null,
            ],
            [
                'nama' => 'Rian Hidayat',
                'jabatan' => 'Kolektor Wilayah 1',
                'nip' => '199008202015031001',
                'foto' => null,
            ],
            [
                'nama' => 'Hendra Wijaya',
                'jabatan' => 'Kolektor Wilayah 2',
                'nip' => '199211102018011003',
                'foto' => null,
            ],
            [
                'nama' => 'Dadan Ramdani',
                'jabatan' => 'Kolektor Wilayah 3',
                'nip' => '199402152020021004',
                'foto' => null,
            ],
            [
                'nama' => 'Asep Saepuloh',
                'jabatan' => 'Kolektor Wilayah 4',
                'nip' => '199507052021031006',
                'foto' => null,
            ],
        ];

        foreach ($personel as $p) {
            StrukturOrganisasiPersonel::updateOrCreate(
                ['nama' => $p['nama'], 'jabatan' => $p['jabatan']],
                $p
            );
        }
    }
}
