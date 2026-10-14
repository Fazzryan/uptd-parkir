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
        // Mengambil objek jukir dari route parameter
        $jukir = $this->route('data_jukir') ?: $this->route('jukir');
        $userId = is_object($jukir) ? $jukir->user_id : null;

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
