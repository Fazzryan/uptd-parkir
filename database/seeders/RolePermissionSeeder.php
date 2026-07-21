<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Permission
        $permissions = [
            'view-users',
            'create-user',
            'edit-user',
            'delete-user',
            'manage-roles',

            'view-profile',
            'edit-profile',

            'view-eviden',
            'create-eviden',
            'edit-eviden',
            'delete-eviden',

            'view-indikator',
            'create-indikator',
            'edit-indikator',
            'delete-indikator',
           
            'view-wilayah-parkir',
            'create-wilayah-parkir',
            'edit-wilayah-parkir',
            'delete-wilayah-parkir',

            'view-struktur-organisasi',
            'create-struktur-organisasi',
            'edit-struktur-organisasi',
            'delete-struktur-organisasi',

            'view-tarif-parkir',
            'create-tarif-parkir',
            'edit-tarif-parkir',
            'delete-tarif-parkir',

            'view-panduan-jukir',
            'create-panduan-jukir',
            'edit-panduan-jukir',
            'delete-panduan-jukir',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Buat Role & Assign Permission
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo([
            'view-wilayah-parkir',
            'create-wilayah-parkir',
            'edit-wilayah-parkir',
            'delete-wilayah-parkir',

            'view-struktur-organisasi',
            'create-struktur-organisasi',
            'edit-struktur-organisasi',
            'delete-struktur-organisasi',

            'view-tarif-parkir',
            'create-tarif-parkir',
            'edit-tarif-parkir',
            'delete-tarif-parkir',

            'view-panduan-jukir',
            'create-panduan-jukir',
            'edit-panduan-jukir',
            'delete-panduan-jukir',
        ]);

        // 3. Buat User Contoh & Assign Role
        // 3. Buat User Admin IP
        $admin = User::firstOrCreate(
            ['username' => 'admin'], // Kunci pencarian
            [
                'name' => 'Admin IP',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole($adminRole);
        
        $user = User::firstOrCreate(
            ['username' => 'user'], // Kunci pencarian
            [
                'name' => 'User',
                'email' => 'user@gmail.com',
                'password' => bcrypt('password'),
            ]
        );
        $user->assignRole($userRole);
    }
}
