<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJukirRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Mengambil user_id jukir dari route parameter untuk mengabaikan unique check pada user yang sama
        $jukirParam = $this->route('data_jukir') ?: $this->route('jukir');
        if ($jukirParam instanceof \App\Models\Jukir) {
            $userId = $jukirParam->user_id;
        } else {
            $jukir = \App\Models\Jukir::where('id', $jukirParam)
                ->orWhere('kode_jukir', $jukirParam)
                ->first();
            $userId = $jukir?->user_id;
        }

        return [
            // Data Diri Jukir
            'nama' => 'required|string|max:255',
            'nohp' => 'required|string|max:15',
            'alamat' => 'required|string',
            'status' => 'required|in:Aktif,Tidak Aktif',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',

            // Akun User Jukir (Ignore ID User Saat Ini)
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => 'nullable|string|min:6',

            // Titik Lokasi Penugasan Parkir
            'wilayah_parkir_id' => 'required|exists:wilayah_parkir,id',

            // Target Retribusi Parkir
            'target_per_hari' => 'nullable|numeric|min:0',
            'tahun' => 'nullable|integer|min:2020|max:2099',
            'jml_hari' => 'nullable|integer|min:1|max:31',
            'keterangan_target' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama lengkap jukir wajib diisi.',
            'nohp.required' => 'Nomor HP wajib diisi.',
            'alamat.required' => 'Alamat tempat tinggal wajib diisi.',
            'status.required' => 'Status keaktifan jukir wajib dipilih.',
            'foto.image' => 'File foto harus berupa gambar.',
            'foto.max' => 'Ukuran foto maksimal 1MB.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan, pilih username lain.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email sudah terdaftar di sistem.',
            'password.min' => 'Password baru minimal 6 karakter.',
            'wilayah_parkir_id.required' => 'Pilih titik lokasi penugasan parkir.',
            'wilayah_parkir_id.exists' => 'Titik lokasi parkir yang dipilih tidak valid.',
        ];
    }
}
