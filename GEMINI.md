# Workspace Guidelines & Rules (UPTD Parkir)

## 1. Panggilan & Profil
- Selalu panggil pengguna dengan sapaan **"Mas"**.
- Pengguna adalah Programmer IT di Diskominfo yang membangun sistem e-government.

---

## 2. Pemeriksaan Wajib Konteks & Dokumentasi Desain (CRITICAL)
1. **Wajib Cek Folder `ai_context/`**:
   - Selalu periksa file-file yang ada di folder `ai_context/` di awal pengerjaan untuk memahami konteks bisnis, aturan khusus, atau dokumen panduan proyek (walaupun pada beberapa proyek folder ini mungkin masih kosong atau baru diisi).
2. **Wajib Cek Folder `docs/` & Terapkan `docs/desain.md`**:
   - Selalu periksa folder `docs/` untuk melihat dokumentasi teknis atau PRD yang relevan.
   - **Wajib menggunakan pedoman [docs/desain.md](file:///d:/Project%20Laravel/kominfo/uptd-parkir/docs/desain.md)** sebagai acuan standar desain UI/UX (warna brand, tipografi *Plus Jakarta Sans*, penggunaan komponen `resources/js/Components/`, dan dark mode) agar seluruh antarmuka aplikasi selalu seragam, konsisten, dan berstandar pemerintahan modern.

---

## 3. Standar Pengodean & Arsitektur
- **Backend**:
   - Mengikuti pola controller yang sudah ada: `Backend/JukirController`, `Backend/WilayahParkirController`, `Backend/TarifParkirKarcisController`, `Backend/PanduanJukirController`, dan `Backend/StrukturOrganisasiController` sebagai acuan pembuatan controller baru.
   - Gunakan Form Request validation, Eloquent relationship, dan resource structure yang rapi.
- **Frontend**:
   - Gunakan React + Inertia.js dan Tailwind CSS.
   - Gunakan komponen siap pakai yang ada di `resources/js/Components/` (seperti `Table`, `Card`, `Badge`, `Button`, `TextInput`, `SelectSearch`, `Modal`, dll) dan hindari utility ad-hoc berulang agar tampilan konsisten.

---

## 4. Batasan & Larangan Mutlak (Safety Guardrails)
1. **Dilarang Menjalankan Perintah Git**:
   - Jangan sekali-kali mengeksekusi perintah git apapun (`git add`, `git commit`, `git push`, `git checkout`, `git stash`, dll) tanpa izin eksplisit dari Mas.
2. **Dilarang Menjalankan Migration Database Sembarangan**:
   - Jangan pernah menjalankan perintah `php artisan migrate`, `migrate:fresh`, `migrate:rollback`, atau `migrate:reset` tanpa persetujuan eksplisit dari Mas.
3. **Dilarang Membuka Browser / Chrome Otomatis**:
   - Biarkan Mas sendiri yang melakukan pengujian (*testing*) secara manual di browser setelah kode dibuat/diubah.
