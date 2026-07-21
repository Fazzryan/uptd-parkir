import { useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  Camera,
  CreditCard,
} from "lucide-react";

/**
 * Halaman: Struktur Organisasi & Personel
 * UPTD Pengelola Parkir - Dishubkominfo Kab. Tasikmalaya
 *
 * Catatan implementasi (Laravel Inertia):
 * - Ganti array `pimpinan`, `kasubag`, `kolektor`, `galeriStaf` menjadi props dari Controller,
 *   idealnya diambil dari tabel `personel` yang dikelola lewat CMS Admin (lihat catatan brief:
 *   admin dapat edit nama, NIP, dan foto saat rotasi pegawai).
 * - `photoUrl: null` berarti foto belum tersedia -> tampil avatar inisial. Begitu ada foto,
 *   isi `photoUrl` dengan path storage, mis. "/storage/personel/kepala-uptd.jpg".
 * - Header/Footer/Floating WA sebaiknya diekstrak jadi <AppLayout> bersama, dipakai juga di Beranda.
 */

const PRIMARY_FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const BODY_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

const avatarPalette = ["bg-blue-700", "bg-blue-600", "bg-sky-600", "bg-indigo-600", "bg-cyan-700"];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Avatar({ name, photoUrl, size = "h-20 w-20", colorIndex = 0 }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${size} rounded-full object-cover ring-4 ring-white shadow`}
      />
    );
  }
  return (
    <div
      className={`${size} ${avatarPalette[colorIndex % avatarPalette.length]} flex items-center justify-center rounded-full text-white ring-4 ring-white shadow`}
      style={{ fontFamily: PRIMARY_FONT }}
    >
      <span className="text-lg font-bold sm:text-xl">{initials(name)}</span>
    </div>
  );
}

function PersonCard({ person, featured = false, colorIndex = 0 }) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm ${
        featured ? "sm:p-8" : ""
      }`}
    >
      <Avatar
        name={person.nama}
        photoUrl={person.photoUrl}
        size={featured ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20"}
        colorIndex={colorIndex}
      />
      <p
        className={`mt-4 font-bold text-slate-800 ${featured ? "text-lg" : "text-sm"}`}
        style={{ fontFamily: PRIMARY_FONT }}
      >
        {person.nama}
      </p>
      <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        {person.jabatan}
      </span>
      <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
        <CreditCard className="h-3.5 w-3.5" />
        <span>NIP. {person.nip}</span>
      </div>
      {!person.photoUrl && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-600">
          <Camera className="h-3 w-3" /> Foto menyusul
        </p>
      )}
    </div>
  );
}

const pimpinan = {
  nama: "Nama Kepala UPTD",
  jabatan: "Kepala UPTD Pengelola Parkir",
  nip: "19xxxxxxxxxxxxxxxx",
  photoUrl: null,
};

const kasubag = {
  nama: "Nama Kasubag TU",
  jabatan: "Kasubag Tata Usaha UPTD",
  nip: "19xxxxxxxxxxxxxxxx",
  photoUrl: null,
};

const kolektor = [
  { nama: "Kolektor Wilayah 1", jabatan: "Kolektor", nip: "19xxxxxxxxxxxxxxxx", photoUrl: null },
  { nama: "Kolektor Wilayah 2", jabatan: "Kolektor", nip: "19xxxxxxxxxxxxxxxx", photoUrl: null },
  { nama: "Kolektor Wilayah 3", jabatan: "Kolektor", nip: "19xxxxxxxxxxxxxxxx", photoUrl: null },
  { nama: "Kolektor Wilayah 4", jabatan: "Kolektor", nip: "19xxxxxxxxxxxxxxxx", photoUrl: null },
];

const galeriStaf = [
  { caption: "Apel pagi staf pelaksana lapangan" },
  { caption: "Pembinaan rutin juru parkir binaan" },
  { caption: "Foto bersama seluruh personel UPTD" },
];

export default function StrukturOrganisasi() {
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
                    item === "Profil" ? "text-white" : "text-blue-100 hover:text-white"
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
            <a href="#" className="hover:text-white">Profil</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Struktur Organisasi</span>
          </div>
          <h1
            className="mt-3 text-2xl font-extrabold text-white sm:text-3xl"
            style={{ fontFamily: PRIMARY_FONT }}
          >
            Struktur Organisasi &amp; Personel
          </h1>
          <p className="mt-2 max-w-lg text-sm text-blue-100">
            Susunan pimpinan, tata usaha, dan petugas kolektor UPTD Pengelola Parkir
            Kabupaten Tasikmalaya.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        {/* ================= PIMPINAN ================= */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
            1 · Pimpinan
          </p>
          <div className="mx-auto max-w-xs">
            <PersonCard person={pimpinan} featured colorIndex={0} />
          </div>
        </section>

        {/* ================= KASUBAG TU ================= */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
            2 · Tata Usaha
          </p>
          <div className="mx-auto max-w-xs">
            <PersonCard person={kasubag} colorIndex={1} />
          </div>
        </section>

        {/* ================= PARA KOLEKTOR ================= */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
            3 · Para Kolektor
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {kolektor.map((k, i) => (
              <PersonCard key={k.nama} person={k} colorIndex={i + 2} />
            ))}
          </div>
        </section>

        {/* ================= GALERI STAF LAPANGAN ================= */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              4 · Foto Bersama &amp; Staf Pelaksana Lapangan
            </p>
            <a href="#galeri" className="flex items-center text-xs font-semibold text-blue-700">
              Lihat galeri <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {galeriStaf.map((g) => (
              <div
                key={g.caption}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">
                  <Camera className="h-6 w-6" />
                </div>
                <p className="p-3 text-xs text-slate-500">{g.caption}</p>
              </div>
            ))}
          </div>
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
