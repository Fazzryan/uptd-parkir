import { useState } from "react";
import {
  Menu,
  X,
  Search,
  MapPin,
  FileText,
  Users,
  Camera,
  BarChart3,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Ticket,
  Building2,
  ScrollText,
} from "lucide-react";

/**
 * Halaman: Beranda
 * UPTD Pengelola Parkir - Dinas Perhubungan Komunikasi dan Informatika
 * Kabupaten Tasikmalaya
 *
 * Catatan implementasi (untuk dipindah ke Laravel Inertia):
 * - Ganti komponen <a href="#"> menjadi <Link href={route('...')}> dari '@inertiajs/react'
 * - Data quickMenu, berita, dan statistik sebaiknya di-pass sebagai props dari Controller
 * - Nomor WhatsApp pada tombol pengaduan (waNumber) wajib diganti dengan nomor resmi hotline
 */

const PRIMARY_FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const BODY_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

const quickMenu = [
  { label: "Profil UPTD", desc: "Tugas, fungsi & struktur", icon: Building2, href: "#profil" },
  { label: "Tarif & Karcis", desc: "Tarif resmi & contoh karcis", icon: Ticket, href: "#tarif" },
  { label: "Wilayah Parkir", desc: "Cek titik parkir resmi", icon: MapPin, href: "#wilayah" },
  { label: "Panduan Jukir", desc: "Ciri-ciri jukir resmi", icon: ShieldCheck, href: "#panduan" },
  { label: "Galeri & Berita", desc: "Dokumentasi kegiatan", icon: Camera, href: "#galeri" },
  { label: "Transparansi", desc: "Capaian retribusi PAD", icon: BarChart3, href: "#transparansi" },
];

const berita = [
  {
    tanggal: "18 Jul 2026",
    kategori: "Penertiban",
    judul: "Penertiban jukir tidak berseragam di kawasan Alun-alun Singaparna",
  },
  {
    tanggal: "12 Jul 2026",
    kategori: "Pengumuman",
    judul: "Update tarif parkir sepeda motor sesuai Perbup terbaru",
  },
  {
    tanggal: "05 Jul 2026",
    kategori: "Pembinaan",
    judul: "Pembinaan rutin atribut dan etika juru parkir binaan UPTD",
  },
];

function TicketCard({ children, className = "" }) {
  return (
    <div className={`relative rounded-2xl bg-white ${className}`}>
      {/* lubang kiri-kanan ala karcis */}
      <span className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50" />
      <span className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50" />
      {children}
    </div>
  );
}

export default function Beranda() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

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
      <header className="sticky top-0 z-40 border-b border-blue-900/10 bg-blue-900/95 backdrop-blur supports-[backdrop-filter]:bg-blue-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              {/* placeholder logo pemkab */}
              <Landmark className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-medium uppercase tracking-wide text-blue-200">
                Pemerintah Kab. Tasikmalaya
              </p>
              <p
                className="text-sm font-bold text-white sm:text-base"
                style={{ fontFamily: PRIMARY_FONT }}
              >
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
                  className="text-sm font-medium text-blue-100 transition hover:text-white"
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

      {/* ================= MOBILE MENU DRAWER ================= */}
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
              {quickMenu.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50"
                >
                  <item.icon className="h-4 w-4 text-blue-700" />
                  {item.label}
                </a>
              ))}
              <a
                href="#kontak"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50"
              >
                <Phone className="h-4 w-4 text-blue-700" />
                Kontak
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 px-4 pb-14 pt-8 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-blue-200">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-medium">Sistem Parkir Resmi &amp; Berkarcis</span>
          </div>

          <h1
            className="mt-4 max-w-xl text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl"
            style={{ fontFamily: PRIMARY_FONT }}
          >
            Parkir Resmi, Tertib, dan Transparan untuk Tasikmalaya
          </h1>
          <p className="mt-3 max-w-lg text-sm text-blue-100 sm:text-base">
            Layanan resmi UPTD Pengelola Parkir — pastikan Anda membayar retribusi
            sesuai tarif Perda kepada juru parkir berseragam dan berkarcis resmi.
          </p>

          {/* Search bar - cek titik parkir */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg shadow-blue-950/20"
          >
            <Search className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Cari nama jalan / kecamatan..."
              className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400 sm:text-sm"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
            >
              Cek Zona
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-blue-100">
            <span className="rounded-full bg-white/10 px-3 py-1">Perda Perparkiran Kab. Tasikmalaya</span>
            <span className="rounded-full bg-white/10 px-3 py-1">uptdparkir.tasikmalayakab.go.id</span>
          </div>
        </div>
      </section>

      <main className="mx-auto -mt-8 max-w-6xl space-y-10 px-4 pb-16 sm:-mt-12">
        {/* ================= PERINGATAN / HAK MASYARAKAT (motif karcis) ================= */}
        <TicketCard className="mx-auto flex max-w-3xl items-start gap-3 border border-dashed border-amber-300 bg-amber-50 p-5 shadow-sm">
          <ScrollText className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-900">
            <span className="font-semibold">Ketahui hak Anda:</span> Masyarakat berhak menolak
            membayar apabila juru parkir tidak menggunakan atribut resmi atau tidak memberikan
            karcis resmi berlambang Pemkab Tasikmalaya.{" "}
            <a href="#panduan" className="font-semibold underline underline-offset-2">
              Lihat ciri jukir resmi
            </a>
          </p>
        </TicketCard>

        {/* ================= QUICK MENU ================= */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-bold text-blue-900" style={{ fontFamily: PRIMARY_FONT }}>
              Layanan Utama
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickMenu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= TRANSPARANSI (motif karcis) ================= */}
        <section id="transparansi">
          <h2 className="mb-4 text-lg font-bold text-blue-900" style={{ fontFamily: PRIMARY_FONT }}>
            Transparansi Retribusi
          </h2>
          <TicketCard className="border border-dashed border-blue-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Capaian PAD Parkir · Contoh data
                </p>
                <p className="mt-1 text-xl font-extrabold text-blue-900 sm:text-2xl" style={{ fontFamily: PRIMARY_FONT }}>
                  Rp 812.4 Jt{" "}
                  <span className="text-xs font-medium text-slate-400 sm:text-sm">/ Rp 1.1 M target</span>
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-blue-50">
              <div className="h-full w-[74%] rounded-full bg-blue-600" />
            </div>
            <p className="mt-2 text-xs text-slate-500">74% dari target realisasi tahun berjalan</p>
          </TicketCard>
        </section>

        {/* ================= BERITA ================= */}
        <section id="galeri">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-bold text-blue-900" style={{ fontFamily: PRIMARY_FONT }}>
              Berita &amp; Pengumuman
            </h2>
            <a href="#" className="flex items-center text-xs font-semibold text-blue-700">
              Lihat semua <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="space-y-3">
            {berita.map((b) => (
              <a
                key={b.judul}
                href="#"
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                    {b.kategori} · {b.tanggal}
                  </p>
                  <p className="truncate text-sm font-medium text-slate-800">{b.judul}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ================= CTA WILAYAH PARKIR ================= */}
        <section
          id="wilayah"
          className="flex flex-col items-start gap-4 rounded-2xl bg-blue-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-300">
              Wilayah Parkir Resmi
            </p>
            <p className="mt-1 max-w-sm text-sm font-semibold sm:text-base" style={{ fontFamily: PRIMARY_FONT }}>
              Temukan titik &amp; zona parkir resmi yang dikelola UPTD di sekitar Anda
            </p>
          </div>
          <a
            href="#wilayah"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-900"
          >
            <MapPin className="h-4 w-4" /> Lihat Peta Zona
          </a>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer id="kontak" className="border-t border-slate-200 bg-white">
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

// placeholder icon (ganti dengan <img> logo Pemkab Tasikmalaya asli)
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
