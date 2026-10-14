<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJukirRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Data Diri Jukir
            'nama' => 'required|string|max:255',
            'nohp' => 'required|string|max:15',
            'alamat' => 'required|string',
            'status' => 'required|in:Aktif,Tidak Aktif',
            'foto' => 'required|image|mimes:jpg,jpeg,png,webp|max:1024',

            // Akun User Jukir
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',

            // Titik Lokasi Penugasan Parkir (1 Titik Lokasi)
            'wilayah_parkir_id' => 'required|exists:wilayah_parkir,id',

            // Opsional jika ada user_id langsung
            'user_id' => 'nullable|exists:users,id|unique:jukir,user_id',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Data Diri Jukir
            'nama.required' => 'Nama lengkap jukir wajib diisi.',
            'nama.max' => 'Nama jukir maksimal 255 karakter.',
            'nohp.required' => 'Nomor HP wajib diisi.',
            'nohp.max' => 'Nomor HP maksimal 15 karakter.',
            'alamat.required' => 'Alamat tempat tinggal wajib diisi.',
            'status.required' => 'Status keaktifan jukir wajib dipilih.',
            'status.in' => 'Status harus berupa Aktif atau Tidak Aktif.',
            'foto.required' => 'Foto jukir wajib diunggah.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'foto.max' => 'Ukuran gambar maksimal 1MB.',

            // Akun User Jukir
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan, pilih username lain.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar di sistem.',
            'password.required' => 'Password akun jukir wajib diisi.',
            'password.min' => 'Password minimal 6 karakter.',

            // Titik Lokasi Penugasan Parkir
            'wilayah_parkir_id.required' => 'Pilih titik lokasi penugasan parkir.',
            'wilayah_parkir_id.exists' => 'Titik lokasi parkir yang dipilih tidak valid.',

            // User ID
            'user_id.unique' => 'Akun user ini sudah terdaftar sebagai juru parkir.',
        ];
    }
}
