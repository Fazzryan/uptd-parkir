<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\RoleRequest;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    /**
     * Display a listing of the roles.
     */
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 10;

        $roles = Role::with('permissions')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Backend/Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    /**
     * Mengelompokkan hak akses (permissions) secara dinamis berdasarkan modul
     */
    protected function getGroupedPermissions()
    {
        $moduleLabels = [
            'user' => 'Manajemen User & Akun',
            'role' => 'Manajemen Role & Hak Akses',
            'profile' => 'Profil Pengguna',
            'wilayah-parkir' => 'Wilayah Parkir',
            'struktur-organisasi' => 'Struktur Organisasi',
            'tarif-parkir' => 'Tarif Parkir & Karcis',
            'panduan-jukir' => 'Panduan Juru Parkir',
            'galeri-foto' => 'Galeri Foto & Dokumentasi',
            'berita' => 'Berita & Pengumuman',
            'jukir' => 'Data Juru Parkir',
            'setoran-harian' => 'Setoran Harian',
        ];

        return Permission::orderBy('name', 'asc')->get()->groupBy(function ($permission) use ($moduleLabels) {
            $name = $permission->name;

            // Prioritas pengecekan modul gabungan / spesifik
            if (str_contains($name, 'user') || str_contains($name, 'role')) {
                return 'User & Role Management';
            }

            foreach ($moduleLabels as $slug => $label) {
                if (str_contains($name, $slug)) {
                    return $label;
                }
            }

            // Fallback otomatis: hilangkan prefix action (view/create/edit/delete/manage) lalu format Title Case
            $cleaned = preg_replace('/^(view|create|edit|delete|manage)-/', '', $name);
            return ucwords(str_replace('-', ' ', $cleaned));
        });
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        return Inertia::render('Backend/Roles/Create', [
            'groupedPermissions' => $this->getGroupedPermissions(),
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(RoleRequest $request): RedirectResponse
    {
        $role = Role::create(['name' => $request->name]);
        if ($request->filled('permissions')) {
            $role->syncPermissions($request->permissions);
        }
        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil dibuat');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $role->load('permissions');
        return Inertia::render('Backend/Roles/Edit', [
            'role' => $role,
            'groupedPermissions' => $this->getGroupedPermissions(),
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);
        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil diubah');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();
        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil dihapus');
    }
}
?>
