<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user()?->getRoleNames(),
                'permissions' => $request->user()?->getAllPermissions()->pluck('name'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'app_settings' => function () {
                return \Illuminate\Support\Facades\Cache::remember('app_settings', 3600, function () {
                    return \Illuminate\Support\Facades\DB::table('settings')
                        ->whereIn('key', ['app_name', 'app_logo', 'primary_color', 'wa_number', 'wa_message', 'teks_hak_pengguna_parkir'])
                        ->pluck('value', 'key');
                });
            },
            'visitor_stats' => fn () => [
                'today' => \App\Models\Pengunjung::whereDate('tanggal', now()->toDateString())->count(),
                'thisWeek' => \App\Models\Pengunjung::whereBetween('tanggal', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()])->count(),
                'thisMonth' => \App\Models\Pengunjung::whereMonth('tanggal', now()->month)->whereYear('tanggal', now()->year)->count(),
                'total' => \App\Models\Pengunjung::count(),
            ],
        ];
    }
}
