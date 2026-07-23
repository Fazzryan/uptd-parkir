<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ConfigController extends Controller
{
    /**
     * Display the user profile settings page.
     */
    public function profile(Request $request)
    {
        return Inertia::render('Backend/Settings/Profile', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'photo' => ['nullable', 'image', 'max:1024'], // 1MB Max
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists (optional logic)
            // Store new photo
            $path = $request->file('photo')->store('profile-photos', 'public');
            // In a real app, you might save this path to a 'profile_photo_path' column
            // For now, we assume standard Laravel behavior or simple update
             $user->forceFill([
                'profile_photo_path' => $path,
            ]);
        }

        $user->fill($request->only('name', 'email'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return redirect()->route('be.settings.profile')->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }

    /**
     * Display the application settings page (Admin Only).
     */
    public function app()
    {
        // Fetch settings from DB
        $settings = DB::table('settings')->pluck('value', 'key');

        return Inertia::render('Backend/Settings/App', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the application settings (Admin Only).
     */
    public function updateApp(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_logo' => 'nullable|image|max:2048', // 2MB
            'primary_color' => 'nullable|string|max:7', // Hex color
            'wa_number' => 'nullable|string|max:50',
            'wa_message' => 'nullable|string|max:1000',
            'teks_hak_pengguna_parkir' => 'nullable|string|max:1000',
        ]);

        // Simpan App Name
        DB::table('settings')->updateOrInsert(
            ['key' => 'app_name'],
            ['value' => $validated['app_name'], 'updated_at' => now()]
        );

        // Simpan Primary Color
        if ($request->has('primary_color')) {
             DB::table('settings')->updateOrInsert(
                ['key' => 'primary_color'],
                ['value' => $validated['primary_color'], 'updated_at' => now()]
            );
        }

        // Simpan WA Number
        if (array_key_exists('wa_number', $validated)) {
            DB::table('settings')->updateOrInsert(
                ['key' => 'wa_number'],
                ['value' => $validated['wa_number'], 'updated_at' => now()]
            );
        }

        // Simpan WA Message
        if (array_key_exists('wa_message', $validated)) {
            DB::table('settings')->updateOrInsert(
                ['key' => 'wa_message'],
                ['value' => $validated['wa_message'], 'updated_at' => now()]
            );
        }

        // Simpan Teks Hak Pengguna Parkir
        if (array_key_exists('teks_hak_pengguna_parkir', $validated)) {
            DB::table('settings')->updateOrInsert(
                ['key' => 'teks_hak_pengguna_parkir'],
                ['value' => $validated['teks_hak_pengguna_parkir'], 'updated_at' => now()]
            );
        }

         // Handle Logo Upload
        if ($request->hasFile('app_logo')) {
            $path = $request->file('app_logo')->store('app-logo', 'public');
            DB::table('settings')->updateOrInsert(
                ['key' => 'app_logo'],
                ['value' => $path, 'updated_at' => now()]
            );
        }

        // Clear Cache agar perubahan langsung terlihat
        \Illuminate\Support\Facades\Cache::forget('app_settings');

        return redirect()->route('be.settings.app')->with('success', 'Pengaturan aplikasi berhasil disimpan.');
    }
}
