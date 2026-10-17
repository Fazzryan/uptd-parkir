<?php

namespace App\Policies;

use App\Models\Jukir;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class JukirPolicy
{
    use HandlesAuthorization;

    /**
     * Berikan hak akses penuh (bypass) untuk pengguna dengan role admin.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Menentukan apakah pengguna boleh melihat daftar jukir.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view-jukir');
    }

    /**
     * Menentukan apakah pengguna boleh melihat detail data jukir atau riwayat setorannya.
     * Jika role jukir: HANYA boleh melihat data miliknya sendiri.
     */
    public function view(User $user, Jukir $jukir): bool
    {
        // Jika akun yang login adalah jukir, kunci hanya untuk data miliknya sendiri
        if ($user->hasRole('jukir')) {
            return (int) $jukir->user_id === (int) $user->id;
        }

        // Untuk petugas / role lain: periksa izin view-jukir atau view-setoran-harian
        return $user->can('view-jukir') || $user->can('view-setoran-harian');
    }

    /**
     * Menentukan apakah pengguna boleh menambahkan data jukir baru.
     */
    public function create(User $user): bool
    {
        return $user->can('create-jukir');
    }

    /**
     * Menentukan apakah pengguna boleh mengubah data jukir.
     */
    public function update(User $user, Jukir $jukir): bool
    {
        // Jukir tidak diperkenankan mengubah data master jukir sendiri tanpa izin edit-jukir
        if ($user->hasRole('jukir')) {
            return false;
        }

        return $user->can('edit-jukir');
    }

    /**
     * Menentukan apakah pengguna boleh menghapus data jukir.
     */
    public function delete(User $user, Jukir $jukir): bool
    {
        return $user->can('delete-jukir');
    }
}
