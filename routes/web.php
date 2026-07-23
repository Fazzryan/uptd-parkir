<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\UserController;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Backend\ConfigController;
use App\Http\Controllers\Frontend\IndexController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\PanduanJukirController;
use App\Http\Controllers\Backend\WilayahParkirController;
use App\Http\Controllers\Backend\TarifParkirKarcisController;
use App\Http\Controllers\Backend\StrukturOrganisasiController;
use App\Http\Controllers\Backend\GaleriFotoController;
use App\Http\Controllers\Backend\BeritaController;

use App\Http\Controllers\Frontend\FeDokumentasiController;
use App\Http\Controllers\Frontend\FePanduanJukirController;
use App\Http\Controllers\Frontend\FeStrukturOrganisasiController;
use App\Http\Controllers\Frontend\FeTarifKarcisController;
use App\Http\Controllers\Frontend\FeWilayahParkirController;

Route::as('fe.')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('beranda');

    Route::get('/dokumentasi', [FeDokumentasiController::class, 'index'])->name('dokumentasi');
    Route::get('/berita/{id}', [FeDokumentasiController::class, 'detail'])->name('berita.detail');
    Route::get('/panduan-jukir', [FePanduanJukirController::class, 'index'])->name('panduan-jukir');
    Route::get('/struktur-organisasi', [FeStrukturOrganisasiController::class, 'index'])->name('struktur-organisasi');
    Route::get('/tarif-parkir', [FeTarifKarcisController::class, 'index'])->name('tarif-parkir');
    Route::get('/wilayah-parkir', [FeWilayahParkirController::class, 'index'])->name('wilayah-parkir');
});

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->middleware('throttle:5,1');
});

Route::post('/logout', [LoginController::class, 'destroy'])->name('logout')->middleware('auth');

Route::middleware(['auth'])->prefix('dashboard')->name('be.')->group(function () {

    // Dashboard Utama
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('panduan-jukir', PanduanJukirController::class)
        ->names('panduan-jukir');

    Route::resource('wilayah-parkir', WilayahParkirController::class)
        ->names('wilayah-parkir');

    Route::resource('tarif-parkir', TarifParkirKarcisController::class)
        ->names('tarif-parkir');

    Route::resource('struktur-organisasi', StrukturOrganisasiController::class)
        ->names('struktur-organisasi');

    Route::resource('galeri-foto', GaleriFotoController::class)
        ->names('galeri-foto');

    Route::resource('berita', BeritaController::class)
        ->names('berita');

    // Manajemen Users (Gunakan plural 'users')
    Route::resource('users', UserController::class)
        ->names('users');

    // Manajemen Roles
    Route::resource('roles', RoleController::class)
        ->names('roles');

    // Settings Routes Group
    Route::prefix('settings')->name('settings.')->group(function () {
        // Profile Routes
        Route::get('/profile', [ConfigController::class, 'profile'])->name('profile');
        Route::match(['put', 'patch'], '/profile', [ConfigController::class, 'updateProfile'])->name('profile.update');
        Route::put('/profile/password', [ConfigController::class, 'updatePassword'])->name('profile.password');

        // App Routes
        Route::middleware('role:admin|user')->group(function () {
            Route::get('/app', [ConfigController::class, 'app'])->name('app');
            Route::post('/app', [ConfigController::class, 'updateApp'])->name('app.update');
        });
    });
});
