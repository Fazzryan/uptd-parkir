import { useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Ticket,
} from "lucide-react";

/**
 * Halaman: Panduan Jukir
 * UPTD Pengelola Parkir - Dishubkominfo Kab. Tasikmalaya
 *
 * Sesuai brief:
 * - Infografis visual atribut resmi jukir (Rompi, Topi, ID Card, Peluit)
 * - Teks penegasan besar: hak masyarakat menolak membayar jika jukir tidak
 *   berseragam/tidak memberi karcis resmi
 *
 * Catatan implementasi:
 * - Ilustrasi memakai pictogram (bukan foto asli) supaya netral & konsisten.
 * - Ganti array `atribut` jadi props kalau kontennya ingin dikelola dari CMS.
 */

const PRIMARY_FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const BODY_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

const atribut = [
  {
    no: 1,
    nama: "Rompi Resmi",
    deskripsi:
      "Rompi keselamatan warna oranye dengan garis reflektif dan identitas UPTD, agar petugas mudah terlihat di jalan.",
  },
  {
    no: 2,
    nama: "Topi Dinas",
    deskripsi: "Topi/peci seragam resmi sebagai bagian dari atribut kerja juru parkir binaan UPTD.",
  },
  {
    no: 3,
    nama: "ID Card",
    deskripsi:
      "Kartu identitas resmi berlogo Pemkab Tasikmalaya, mencantumkan nama dan nomor registrasi petugas.",
  },
  {
    no: 4,
    nama: "Peluit",
    deskripsi: "Alat bantu resmi untuk mengatur arus kendaraan keluar-masuk di titik parkir.",
  },
];

const checklist = [
  "Petugas memakai rompi & topi resmi berlogo UPTD",
  "Bersedia menunjukkan ID Card saat diminta",
  "Memberikan karcis resmi bertanda Pemkab Tasikmalaya",
];

function NumberBadge({ n, style }) {
  return (
    <div
      className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white ring-2 ring-white"
      style={style}
    >
      {n}
    </div>
  );
}

export default function PanduanJukir() {
  const [menuOpen, setMenuOpen] = useState(false);

  const waNumber = "6281234567890"; // TODO: ganti nomor hotline resmi
  const waMessage = encodeURIComponent(
    "Halo UPTD Parkir Kab. Tasikmalaya, saya ingin membuat laporan.\n#Nama: \n#Lokasi Kejadian: \n#Jenis Pelanggaran (Tarif Getok/Jukir Liar/Tanpa Karcis): \n#Bukti Foto/Video: "
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: BODY_FONT }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap"
      />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-blue-900/10 bg-blue-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <Landmark className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-medium uppercase tracking-wide text-blue-200">
                Pemerintah Kab. Tasikmalaya
              </p>
              <p className="text-sm font-bold text-white sm:text-base" style={{ fontFamily: PRIMARY_FONT }}>
                UPTD Pengelola Parkir Dishubkominfo
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            {["Profil", "Tarif & Regulasi", "Panduan Jukir", "Galeri", "Transparansi", "Kontak"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className={`text-sm font-medium transition ${
                    item === "Panduan Jukir" ? "text-white" : "text-blue-100 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              )
            )}
          </nav>

          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-white lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <p className="font-semibold text-blue-900" style={{ fontFamily: PRIMARY_FONT }}>
                Menu
              </p>
              <button onClick={() => setMenuOpen(false)} aria-label="Tutup menu">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {["Profil", "Tarif & Regulasi", "Panduan Jukir", "Galeri", "Transparansi", "Kontak"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 px-4 pb-10 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-1.5 text-xs text-blue-200">
            <a href="#" className="hover:text-white">Beranda</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Panduan Jukir</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl" style={{ fontFamily: PRIMARY_FONT }}>
            Kenali Juru Parkir Resmi
          </h1>
          <p className="mt-2 max-w-lg text-sm text-blue-100">
            Empat atribut wajib yang dipakai juru parkir binaan UPTD Kabupaten Tasikmalaya
            saat bertugas di lapangan.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        {/* ================= INFOGRAFIS ================= */}
        <section className="grid gap-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center">
          {/* Ilustrasi pictogram petugas */}
          <div className="relative mx-auto w-full max-w-[220px]">
            <svg viewBox="0 0 220 300" className="w-full">
              {/* siluet kepala */}
              <circle cx="110" cy="58" r="30" fill="#334155" />
              {/* siluet badan */}
              <path d="M72,92 L148,92 L138,232 L82,232 Z" fill="#334155" />
              {/* topi dinas */}
              <rect x="78" y="30" width="64" height="10" rx="5" fill="#1e3a8a" />
              <rect x="86" y="20" width="48" height="16" rx="8" fill="#1e3a8a" />
              {/* rompi */}
              <rect x="80" y="98" width="60" height="100" rx="6" fill="#f97316" />
              <rect x="80" y="130" width="60" height="7" fill="#fff7ed" />
              <rect x="80" y="160" width="60" height="7" fill="#fff7ed" />
              {/* tali id card */}
              <line x1="110" y1="92" x2="105" y2="120" stroke="#94a3b8" strokeWidth="2" />
              {/* id card */}
              <rect x="95" y="120" width="22" height="30" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="95" y="120" width="22" height="7" rx="2" fill="#2563eb" />
              {/* peluit */}
              <line x1="128" y1="94" x2="150" y2="118" stroke="#94a3b8" strokeWidth="2" />
              <ellipse cx="152" cy="121" rx="8" ry="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>

            <NumberBadge n={1} style={{ left: "8%", top: "48%" }} />
            <NumberBadge n={2} style={{ left: "66%", top: "5%" }} />
            <NumberBadge n={3} style={{ left: "36%", top: "44%" }} />
            <NumberBadge n={4} style={{ left: "78%", top: "40%" }} />
          </div>

          {/* Legenda atribut */}
          <div className="grid gap-4 sm:grid-cols-2">
            {atribut.map((a) => (
              <div key={a.no} className="flex gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {a.no}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800" style={{ fontFamily: PRIMARY_FONT }}>
                    {a.nama}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{a.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PENEGASAN BESAR ================= */}
        <section className="rounded-2xl bg-blue-900 px-6 py-10 text-center sm:px-10">
          <ShieldAlert className="mx-auto h-8 w-8 text-amber-400" />
          <p
            className="mx-auto mt-4 max-w-2xl text-xl font-extrabold leading-snug text-white sm:text-2xl lg:text-3xl"
            style={{ fontFamily: PRIMARY_FONT }}
          >
            Masyarakat berhak menolak membayar jika jukir tidak menggunakan atribut resmi
            atau menolak memberikan karcis resmi berlambang Pemkab Tasikmalaya.
          </p>
        </section>

        {/* ================= CHECKLIST CEPAT ================= */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
            Sebelum Membayar, Cek 3 Hal Ini
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {checklist.map((c, i) => (
              <div
                key={c}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <p className="text-sm text-slate-700">{c}</p>
              </div>
            ))}
          </div>
          <a
            href="#tarif"
            className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-800"
          >
            <Ticket className="h-4 w-4 shrink-0" />
            Belum yakin bentuk karcis resminya? Lihat contoh karcis di halaman Tarif &amp; Regulasi
            <ChevronRight className="ml-auto h-4 w-4 shrink-0" />
          </a>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-bold text-blue-900" style={{ fontFamily: PRIMARY_FONT }}>
                UPTD Pengelola Parkir
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Dinas Perhubungan Komunikasi dan Informatika Kabupaten Tasikmalaya
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                <span>Kantor UPTD Parkir, Kab. Tasikmalaya (alamat lengkap — menyusul)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-700" />
                <span>(0265) 000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-700" />
                <span>uptdparkir@tasikmalayakab.go.id</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <div className="flex h-32 items-center justify-center text-xs text-slate-400">
                Peta lokasi kantor (Google Maps embed)
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            © 2026 UPTD Pengelola Parkir · Pemerintah Kabupaten Tasikmalaya
          </div>
        </div>
      </footer>

      {/* ================= FLOATING WHATSAPP - PENGADUAN ================= */}
      <a
        href={`https://wa.me/${waNumber}?text=${waMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:scale-105"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-500/40" />
        <MessageCircle className="h-4.5 w-4.5" />
        <span className="hidden sm:inline">Laporkan Jukir Liar</span>
        <span className="sm:hidden">Lapor</span>
      </a>
    </div>
  );
}

function Landmark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}
