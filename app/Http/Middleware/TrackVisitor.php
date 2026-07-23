<?php

namespace App\Http\Middleware;

use App\Models\Pengunjung;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitor
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Hanya catat untuk request web GET non-AJAX / non-asset
        if ($request->isMethod('GET') && !$request->expectsJson() && !$request->is('api/*', 'storage/*', 'build/*', 'favicon.ico')) {
            try {
                $userAgent = $request->header('User-Agent');
                $ipAddress = $request->ip();
                $sessionId = session()->getId();
                $url = $request->fullUrl();
                $referer = $request->header('referer');

                $device = $this->parseDevice($userAgent);
                $browser = $this->parseBrowser($userAgent);
                $platform = $this->parsePlatform($userAgent);

                Pengunjung::create([
                    'ip_address' => $ipAddress,
                    'session_id' => $sessionId,
                    'url' => $url,
                    'referer' => $referer,
                    'user_agent' => $userAgent,
                    'device' => $device,
                    'browser' => $browser,
                    'platform' => $platform,
                    'tanggal' => now()->toDateString(),
                ]);
            } catch (\Throwable $e) {
                // Abaikan jika terjadi kesalahan pencatatan agar tidak melempar 500 ke user
            }
        }

        return $response;
    }

    private function parseDevice(?string $userAgent): string
    {
        if (!$userAgent) return 'Desktop';
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $userAgent)) {
            return 'Tablet';
        }
        if (preg_match('/(mobi|ipod|iphone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo)/i', $userAgent)) {
            return 'Mobile';
        }
        return 'Desktop';
    }

    private function parseBrowser(?string $userAgent): string
    {
        if (!$userAgent) return 'Unknown';
        if (preg_match('/Edg/i', $userAgent)) return 'Edge';
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Opera|OPR/i', $userAgent)) return 'Opera';
        return 'Other';
    }

    private function parsePlatform(?string $userAgent): string
    {
        if (!$userAgent) return 'Unknown';
        if (preg_match('/windows|win32/i', $userAgent)) return 'Windows';
        if (preg_match('/android/i', $userAgent)) return 'Android';
        if (preg_match('/iphone|ipad|ipod/i', $userAgent)) return 'iOS';
        if (preg_match('/macintosh|mac os x/i', $userAgent)) return 'macOS';
        if (preg_match('/linux/i', $userAgent)) return 'Linux';
        return 'Other';
    }
}
