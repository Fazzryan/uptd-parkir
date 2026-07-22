import { useMemo, useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  Search,
  ShieldCheck,
  Navigation,
  SearchX,
} from "lucide-react";
import Footer from "./Layouts/Footer";

/**
 * Halaman: Wilayah Parkir Resmi
 * UPTD Pengelola Parkir - Dishubkominfo Kab. Tasikmalaya
 *
 * Sesuai brief:
 * - Daftar jalan/titik area parkir resmi yang dikelola UPTD
 * - Search bar nama jalan/kecamatan agar warga mudah cek legalitas titik parkir
 *
 * Catatan implementasi (Laravel Inertia):
 * - Data `zonaParkir` sebaiknya dari tabel `zona_parkir` (props dari Controller), sudah
 *   difilter di backend kalau datanya besar. Untuk dataset kecil, filter client-side (seperti
 *   di sini) sudah cukup dan terasa instan di HP.
 * - Tombol "Buka di Maps" pakai deep-link pencarian Google Maps (tidak perlu API key).
 *   Kalau nanti mau embed peta interaktif penuh, ganti dengan Google Maps JavaScript API
 *   / Leaflet + koordinat lat-lng per zona.
 */

const PRIMARY_FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const BODY_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

const kecamatanList = ["Semua", "Singaparna", "Rajapolah", "Manonjaya", "Cikatomas", "Salopa"];

const zonaParkir = [
  { jalan: "Jl. Raya Singaparna (depan Pasar)", kecamatan: "Singaparna", kode: "SGP-01", kategori: "Roda 2 & Roda 4" },
  { jalan: "Jl. Terminal Singaparna", kecamatan: "Singaparna", kode: "SGP-02", kategori: "Roda 4" },
  { jalan: "Jl. Raya Rajapolah - Simpang Tiga", kecamatan: "Rajapolah", kode: "RJP-01", kategori: "Roda 2" },
  { jalan: "Jl. Pasar Rajapolah", kecamatan: "Rajapolah", kode: "RJP-02", kategori: "Roda 2 & Roda 4" },
  { jalan: "Jl. Raya Manonjaya (Alun-alun)", kecamatan: "Manonjaya", kode: "MNJ-01", kategori: "Roda 2 & Roda 4" },
  { jalan: "Jl. Cikatomas - Pasar Baru", kecamatan: "Cikatomas", kode: "CKT-01", kategori: "Roda 2" },
  { jalan: "Jl. Raya Salopa", kecamatan: "Salopa", kode: "SLP-01", kategori: "Roda 2 & Roda 4" },
];

export default function WilayahParkir() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [kecamatanAktif, setKecamatanAktif] = useState("Semua");

  const hasil = useMemo(() => {
    const q = query.trim().toLowerCase();
    return zonaParkir.filter((z) => {
      const cocokKecamatan = kecamatanAktif === "Semua" || z.kecamatan === kecamatanAktif;
      const cocokQuery =
        q === "" || z.jalan.toLowerCase().includes(q) || z.kecamatan.toLowerCase().includes(q);
      return cocokKecamatan && cocokQuery;
    });
  }, [query, kecamatanAktif]);

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
                    item === "Tarif & Regulasi" ? "text-white" : "text-blue-100 hover:text-white"
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
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 px-4 pb-8 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-1.5 text-xs text-blue-200">
            <a href="#" className="hover:text-white">Beranda</a>
            <ChevronRight className="h-3 w-3" />
            <a href="#" className="hover:text-white">Tarif & Regulasi</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Wilayah Parkir Resmi</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl" style={{ fontFamily: PRIMARY_FONT }}>
            Wilayah Parkir Resmi
          </h1>
          <p className="mt-2 max-w-lg text-sm text-blue-100">
            Cek apakah titik parkir yang Anda gunakan resmi dikelola dan retribusinya sah
            ditarik oleh UPTD Kabupaten Tasikmalaya.
          </p>
        </div>
      </section>

      {/* ================= SEARCH + FILTER (sticky) ================= */}
      <div className="sticky top-[60px] z-30 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <Search className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Cari nama jalan atau kecamatan..."
              className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400 sm:text-sm"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {kecamatanList.map((k) => (
              <button
                key={k}
                onClick={() => setKecamatanAktif(k)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  kecamatanAktif === k
                    ? "bg-blue-700 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <p className="text-xs text-slate-500">
          Menampilkan <span className="font-semibold text-slate-700">{hasil.length}</span> dari{" "}
          {zonaParkir.length} titik parkir resmi
        </p>

        {/* ================= DAFTAR LOKASI ================= */}
        {hasil.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {hasil.map((z) => (
              <div
                key={z.kode}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800" style={{ fontFamily: PRIMARY_FONT }}>
                      {z.jalan}
                    </p>
                    <p className="text-xs text-slate-500">Kec. {z.kecamatan} · Kode {z.kode}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" /> Zona Resmi
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                    {z.kategori}
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${z.jalan}, ${z.kecamatan}, Kabupaten Tasikmalaya`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  <Navigation className="h-3.5 w-3.5" /> Buka di Google Maps
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
            <SearchX className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Titik parkir tidak ditemukan</p>
            <p className="max-w-xs text-xs text-slate-400">
              Coba kata kunci lain, atau pilih "Semua" pada filter kecamatan di atas.
            </p>
          </div>
        )}

        {/* ================= CTA LAPOR JIKA TIDAK ADA DI DAFTAR ================= */}
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">
            Menemukan penarikan parkir di luar titik yang terdaftar di atas? Ini berpotensi
            <span className="font-semibold"> jukir liar</span>.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white"
          >
            Laporkan Sekarang
          </a>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

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
