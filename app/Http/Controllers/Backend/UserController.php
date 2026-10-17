<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-users')->only('index');
        $this->middleware('permission:create-user')->only(['create', 'store']);
        $this->middleware('permission:edit-user')->only(['edit', 'update']);
        $this->middleware('permission:delete-user')->only('destroy');
    }
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        
        $query = User::query()
            ->with(['roles:id,name']);

        // Filter Pencarian (Nama, Username, Email, atau Role)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('roles', function ($r) use ($search) {
                      $r->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter Berdasarkan Role Tertentu
        if ($role = $request->input('role')) {
            $query->whereHas('roles', function ($r) use ($role) {
                $r->where('name', $role);
            });
        }

        $users = $query->latest('id')
            ->paginate($perPage)
            ->withQueryString();
        
        // Return JSON jika request via AJAX / axios
        if ($request->wantsJson()) {
            return response()->json($users);
        }

        $rolesList = \Spatie\Permission\Models\Role::orderBy('name', 'asc')->get(['id', 'name']);

        return Inertia::render('Backend/Users/Index', [
            'users' => $users,
            'rolesList' => $rolesList,
            'filters' => [
                'search' => $request->input('search', ''),
                'role' => $request->input('role', ''),
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Users/Create', [
            'roles' => \Spatie\Permission\Models\Role::all(),
            // Removed skpds
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'required|array',
            // Removed skpd_id
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            // Removed skpd_id
        ]);

        $user->assignRole($request->roles);

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dibuat!');
    }

    public function edit(User $user)
    {
        return Inertia::render('Backend/Users/Edit', [
            'user' => $user->load(['roles']), // Removed skpd
            'roles' => \Spatie\Permission\Models\Role::all(),
            'userRoles' => $user->getRoleNames(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'required|array',
        ]);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);
        $user->syncRoles($request->roles);

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        // Proteksi: Jangan biarkan user menghapus dirinya sendiri
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
        }

        $user->delete();

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dihapus!');
    }
}
