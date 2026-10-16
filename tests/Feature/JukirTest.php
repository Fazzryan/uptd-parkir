<?php

namespace Tests\Feature;

use App\Models\Jukir;
use App\Models\JukirTarget;
use App\Models\Kecamatan;
use App\Models\User;
use App\Models\WilayahParkir;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class JukirTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected WilayahParkir $wilayahParkir;
    protected Kecamatan $kecamatan;

    /**
     * Setup environment data sebelum setiap test dijalankan.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // 1. Inisialisasi disk fake untuk testing upload file gambar
        Storage::fake('public');

        // 2. Buat role 'admin' dan 'user' (dibutuhkan oleh sistem Spatie Permission)
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);

        // 3. Buat user admin yang terautentikasi untuk mengakses panel dashboard
        $this->adminUser = User::factory()->create([
            'name' => 'Administrator Dishub',
            'email' => 'admin@uptdparkir.test',
            'username' => 'admin_dishub',
            'password' => Hash::make('password'),
        ]);
        $this->adminUser->assignRole('admin');

        // 4. Siapkan master data Kecamatan dan Titik Wilayah Parkir
        $this->kecamatan = Kecamatan::create([
            'id_kecamatan' => '320601',
            'nama_kecamatan' => 'Ciawi',
            'alamat' => 'Jl. Raya Ciawi',
        ]);

        $this->wilayahParkir = WilayahParkir::create([
            'kecamatan_id' => $this->kecamatan->id,
            'nama_jalan' => 'Jl. Pelita Harapan Ciawi',
            'latitude' => '-7.3274',
            'longitude' => '108.2207',
        ]);
    }

    /**
     * Test 1: Halaman form tambah jukir dapat diakses oleh admin.
     */
    public function test_halaman_tambah_jukir_dapat_diakses_oleh_admin(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('be.data-jukir.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Backend/Jukir/Create')
                ->has('wilayahParkir')
        );
    }

    /**
     * Test 2: Pengguna non-login (guest) tidak boleh mengakses form tambah jukir.
     */
    public function test_guest_tidak_dapat_mengakses_halaman_tambah_jukir(): void
    {
        $response = $this->get(route('be.data-jukir.create'));

        // Harus dialihkan ke halaman login
        $response->assertRedirect('/login');
    }

    /**
     * Test 3: Admin berhasil membuat data jukir baru beserta akun user dan penugasan wilayah.
     */
    public function test_admin_berhasil_membuat_jukir_beserta_akun_user_dan_wilayah(): void
    {
        // Siapkan fake file foto profil jukir
        $fotoFake = UploadedFile::fake()->image('foto_jukir.jpg', 300, 300)->size(500);

        $payload = [
            'nama' => 'Asep Kurniawan',
            'nohp' => '081298765432',
            'alamat' => 'Kp. Babakan Jaya RT 02 RW 05, Ciawi',
            'status' => 'Aktif',
            'foto' => $fotoFake,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'username' => 'asep_jukir',
            'email' => 'asep.jukir@test.com',
            'password' => 'secret123',
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('be.data-jukir.store'), $payload);

        // Harus berhasil dan redirect kembali ke daftar jukir
        $response->assertRedirect(route('be.data-jukir.index'));
        $response->assertSessionHas('success');

        // Verifikasi akun user jukir tersimpan di tabel 'users'
        $this->assertDatabaseHas('users', [
            'username' => 'asep_jukir',
            'email' => 'asep.jukir@test.com',
        ]);

        $createdUser = User::where('username', 'asep_jukir')->first();
        $this->assertNotNull($createdUser);
        $this->assertTrue($createdUser->hasRole('user'));

        // Verifikasi profil jukir tersimpan di tabel 'jukir'
        $this->assertDatabaseHas('jukir', [
            'user_id' => $createdUser->id,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'nama' => 'Asep Kurniawan',
            'nohp' => '081298765432',
            'alamat' => 'Kp. Babakan Jaya RT 02 RW 05, Ciawi',
            'status' => 'Aktif',
        ]);

        $createdJukir = Jukir::where('user_id', $createdUser->id)->first();
        $this->assertNotNull($createdJukir);

        // Verifikasi kode unik jukir terbentuk (Format: KEC-NAMA-XXXX)
        // Kecamatan Ciawi -> 'CIA', Nama Asep -> 'ASEP'
        $this->assertStringStartsWith('CIA-ASEP-', $createdJukir->kode_jukir);

        // Verifikasi file foto tersimpan di storage public
        $this->assertNotNull($createdJukir->foto);
        Storage::disk('public')->assertExists($createdJukir->foto);
    }

    /**
     * Test 4: Admin berhasil membuat jukir sekaligus otomatis men-generate target retribusi 12 bulan.
     */
    public function test_otomatis_generate_target_retribusi_12_bulan_untuk_jukir_baru(): void
    {
        $fotoFake = UploadedFile::fake()->image('foto_budi.jpg', 200, 200);

        $payload = [
            'nama' => 'Budi Sudarsono',
            'nohp' => '085712345678',
            'alamat' => 'Jl. Desa Kertamukti No. 15',
            'status' => 'Aktif',
            'foto' => $fotoFake,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'username' => 'budi_sud',
            'email' => 'budi.sud@test.com',
            'password' => 'password123',

            // Data Target Retribusi
            'target_per_hari' => 15000,
            'tahun' => 2026,
            'jml_hari' => 26,
            'keterangan_target' => 'Target Anggaran Penetapan Dishub Ciawi 2026',
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('be.data-jukir.store'), $payload);

        $response->assertRedirect(route('be.data-jukir.index'));

        $jukir = Jukir::where('nama', 'Budi Sudarsono')->first();
        $this->assertNotNull($jukir);

        // Verifikasi bahwa terbuat tepat 12 baris target bulanan (Januari s/d Desember)
        $targets = JukirTarget::where('jukir_id', $jukir->id)
            ->where('tahun', 2026)
            ->orderBy('bulan', 'asc')
            ->get();

        $this->assertCount(12, $targets);

        // Verifikasi setiap bulan (1 - 12) memiliki target harian & total target yang benar
        // Total per bulan = target_per_hari * jml_hari = 15.000 * 26 = 390.000
        $expectedMonthlyTarget = 15000 * 26; // 390.000

        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $targetBulanIni = $targets->firstWhere('bulan', $bulan);
            $this->assertNotNull($targetBulanIni, "Target untuk bulan ke-{$bulan} harus ada.");
            $this->assertEquals(15000, (float) $targetBulanIni->target_per_hari);
            $this->assertEquals(26, $targetBulanIni->jml_hari);
            $this->assertEquals($expectedMonthlyTarget, (float) $targetBulanIni->total_target);
            $this->assertEquals('Target Anggaran Penetapan Dishub Ciawi 2026', $targetBulanIni->keterangan);
        }
    }

    /**
     * Test 5: Validasi field input wajib tidak boleh kosong.
     */
    public function test_validasi_input_wajib_saat_membuat_jukir(): void
    {
        // Kirim payload kosong
        $response = $this->actingAs($this->adminUser)
            ->post(route('be.data-jukir.store'), []);

        // Harus mengembalikan error validasi untuk semua field wajib
        $response->assertSessionHasErrors([
            'nama',
            'nohp',
            'alamat',
            'status',
            'foto',
            'username',
            'email',
            'password',
            'wilayah_parkir_id',
        ]);
    }

    /**
     * Test 6: Validasi username dan email harus unik (tidak boleh duplikat).
     */
    public function test_validasi_username_dan_email_harus_unik(): void
    {
        // Buat user yang sudah ada sebelumnya
        User::factory()->create([
            'username' => 'jukir_lama',
            'email' => 'jukir.lama@test.com',
        ]);

        $payload = [
            'nama' => 'Jukir Baru',
            'nohp' => '081234567899',
            'alamat' => 'Jl. Baru No. 1',
            'status' => 'Aktif',
            'foto' => UploadedFile::fake()->image('foto.jpg'),
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'username' => 'jukir_lama', // DUPLIKAT
            'email' => 'jukir.lama@test.com', // DUPLIKAT
            'password' => 'password123',
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('be.data-jukir.store'), $payload);

        $response->assertSessionHasErrors(['username', 'email']);
    }

    /**
     * Test 7: Validasi target retribusi tidak boleh bernilai negatif.
     */
    public function test_validasi_target_retribusi_tidak_boleh_negatif(): void
    {
        $payload = [
            'nama' => 'Dani Hamdani',
            'nohp' => '081234567812',
            'alamat' => 'Jl. Sukasenang',
            'status' => 'Aktif',
            'foto' => UploadedFile::fake()->image('dani.jpg'),
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'username' => 'dani_h',
            'email' => 'dani@test.com',
            'password' => 'password123',
            'target_per_hari' => -5000, // Nilai tidak valid (negatif)
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('be.data-jukir.store'), $payload);

        $response->assertSessionHasErrors(['target_per_hari']);
    }

    /**
     * Test 8: Validasi format dan ukuran file foto (maksimal 1MB).
     */
    public function test_validasi_foto_jukir_maksimal_1mb(): void
    {
        // Buat fake file gambar berukuran 1.5MB (1536 KB > 1024 KB)
        $fotoBesar = UploadedFile::fake()->create('foto_besar.jpg', 1536, 'image/jpeg');

        $payload = [
            'nama' => 'Eka Prasetya',
            'nohp' => '081234567800',
            'alamat' => 'Jl. Raya Timur',
            'status' => 'Aktif',
            'foto' => $fotoBesar,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'username' => 'eka_p',
            'email' => 'eka@test.com',
            'password' => 'password123',
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('be.data-jukir.store'), $payload);

        $response->assertSessionHasErrors(['foto']);
    }

    /**
     * Test 9: Halaman edit data jukir dapat diakses oleh admin.
     */
    public function test_halaman_edit_jukir_dapat_diakses_oleh_admin(): void
    {
        // Buat user & jukir dummy
        $user = User::factory()->create(['username' => 'jukir_edit', 'email' => 'edit@test.com']);
        $jukir = Jukir::create([
            'user_id' => $user->id,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'kode_jukir' => 'CIA-TEST-0001',
            'nama' => 'Jukir Edit Test',
            'nohp' => '081234567890',
            'alamat' => 'Alamat lama',
            'status' => 'Aktif',
            'foto' => 'jukir/dummy.jpg',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->get(route('be.data-jukir.edit', $jukir->id));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Backend/Jukir/Edit')
                ->has('jukir')
                ->has('wilayahParkir')
        );
    }

    /**
     * Test 10: Admin berhasil memperbarui data jukir beserta target retribusinya.
     */
    public function test_admin_berhasil_memperbarui_data_jukir_dan_target_retribusi(): void
    {
        $user = User::factory()->create(['username' => 'jukir_update', 'email' => 'update@test.com']);
        $jukir = Jukir::create([
            'user_id' => $user->id,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'kode_jukir' => 'CIA-UPDT-0001',
            'nama' => 'Nama Sebelum Update',
            'nohp' => '081200000000',
            'alamat' => 'Alamat Sebelum Update',
            'status' => 'Aktif',
            'foto' => 'jukir/foto_awal.jpg',
        ]);

        // Buat titik wilayah baru untuk pengujian pemindahan wilayah
        $wilayahBaru = WilayahParkir::create([
            'kecamatan_id' => $this->kecamatan->id,
            'nama_jalan' => 'Jl. Alun-alun Ciawi',
        ]);

        $payload = [
            'nama' => 'Nama Sesudah Update',
            'nohp' => '081299999999',
            'alamat' => 'Alamat Baru Lengkap',
            'status' => 'Aktif',
            'wilayah_parkir_id' => $wilayahBaru->id,
            'username' => 'jukir_update',
            'email' => 'update@test.com',
            // Target baru
            'target_per_hari' => 20000,
            'tahun' => 2026,
            'jml_hari' => 26,
            'keterangan_target' => 'Penyesuaian target baru 2026',
        ];

        $response = $this->actingAs($this->adminUser)
            ->put(route('be.data-jukir.update', $jukir->id), $payload);

        $response->assertRedirect(route('be.data-jukir.index'));
        $response->assertSessionHas('success');

        // Verifikasi profil jukir terupdate di database
        $this->assertDatabaseHas('jukir', [
            'id' => $jukir->id,
            'nama' => 'Nama Sesudah Update',
            'nohp' => '081299999999',
            'alamat' => 'Alamat Baru Lengkap',
            'wilayah_parkir_id' => $wilayahBaru->id,
        ]);

        // Verifikasi 12 bulan target retribusi terupdate dengan nominal baru (20.000 * 26 = 520.000)
        $targets = JukirTarget::where('jukir_id', $jukir->id)
            ->where('tahun', 2026)
            ->get();

        $this->assertCount(12, $targets);
        $this->assertEquals(20000, (float) $targets->first()->target_per_hari);
        $this->assertEquals(520000, (float) $targets->first()->total_target);
    }

    /**
     * Test 11: Admin berhasil menonaktifkan status juru parkir tanpa menghapus data dari database.
     */
    public function test_admin_berhasil_menonaktifkan_status_jukir(): void
    {
        $userJukir = User::factory()->create();
        $jukir = Jukir::create([
            'user_id' => $userJukir->id,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'kode_jukir' => 'CIA-TEST-001',
            'nama' => 'Jukir Aktif',
            'nohp' => '081234567890',
            'alamat' => 'Tasikmalaya',
            'status' => 'Aktif',
            'foto' => 'jukir/dummy.jpg',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete(route('be.data-jukir.destroy', $jukir->id));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Pastikan status menjadi Tidak Aktif dan data TIDAK terhapus dari tabel
        $this->assertDatabaseHas('jukir', [
            'id' => $jukir->id,
            'status' => 'Tidak Aktif',
            'deleted_at' => null,
        ]);
    }

    /**
     * Test 12: Admin berhasil mengaktifkan kembali juru parkir yang berstatus Tidak Aktif.
     */
    public function test_admin_berhasil_mengaktifkan_kembali_jukir_yang_tidak_aktif(): void
    {
        $userJukir = User::factory()->create();
        $jukir = Jukir::create([
            'user_id' => $userJukir->id,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'kode_jukir' => 'CIA-TEST-002',
            'nama' => 'Jukir Nonaktif',
            'nohp' => '081234567891',
            'alamat' => 'Tasikmalaya',
            'status' => 'Tidak Aktif',
            'foto' => 'jukir/dummy.jpg',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete(route('be.data-jukir.destroy', $jukir->id));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('jukir', [
            'id' => $jukir->id,
            'status' => 'Aktif',
            'deleted_at' => null,
        ]);
    }

    /**
     * Test 13: Juru parkir berstatus Tidak Aktif ditolak saat login dengan pesan error validasi.
     */
    public function test_jukir_dengan_status_tidak_aktif_ditolak_saat_login(): void
    {
        $user = User::factory()->create([
            'username' => 'jukir_nonaktif',
            'password' => Hash::make('password123'),
        ]);
        $user->assignRole('user');

        Jukir::create([
            'user_id' => $user->id,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'kode_jukir' => 'CIA-NON-001',
            'nama' => 'Jukir Off',
            'nohp' => '081234567892',
            'alamat' => 'Tasikmalaya',
            'status' => 'Tidak Aktif',
            'foto' => 'jukir/dummy.jpg',
        ]);

        $response = $this->post(route('login'), [
            'username' => 'jukir_nonaktif',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors(['username']);
        $this->assertGuest();
    }

    /**
     * Test 14: Juru parkir berstatus Aktif berhasil login dan masuk ke dashboard.
     */
    public function test_jukir_dengan_status_aktif_berhasil_login(): void
    {
        $user = User::factory()->create([
            'username' => 'jukir_aktif',
            'password' => Hash::make('password123'),
        ]);
        $user->assignRole('user');

        Jukir::create([
            'user_id' => $user->id,
            'wilayah_parkir_id' => $this->wilayahParkir->id,
            'kode_jukir' => 'CIA-AKT-001',
            'nama' => 'Jukir On',
            'nohp' => '081234567893',
            'alamat' => 'Tasikmalaya',
            'status' => 'Aktif',
            'foto' => 'jukir/dummy.jpg',
        ]);

        $response = $this->post(route('login'), [
            'username' => 'jukir_aktif',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('be.dashboard'));
        $this->assertAuthenticatedAs($user);
    }
}

