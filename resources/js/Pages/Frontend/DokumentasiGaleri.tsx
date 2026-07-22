import { useMemo, useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  Camera,
  Newspaper,
  FileText,
  SearchX,
  ExternalLink,
} from "lucide-react";
import Footer from "./Layouts/Footer";

/**
 * Halaman: Dokumentasi / Galeri
 * UPTD Pengelola Parkir - Dishubkominfo Kab. Tasikmalaya
 *
 * Sesuai brief, halaman ini punya 2 sub-bagian:
 * - Galeri Foto Kegiatan (Penertiban, Pembinaan)
 * - Berita & Pengumuman Resmi
 *
 * Catatan implementasi (Laravel Inertia):
 * - Data `galeriFoto` & `berita` sebaiknya dari tabel masing-masing (props Controller),
 *   idealnya dengan pagination kalau datanya sudah banyak.
 * - `foto: null` berarti gambar belum diunggah -> tampil placeholder ikon kamera.
 *   Begitu ada file asli, isi `foto` dengan path storage, mis. "/storage/galeri/xxx.jpg".
 * - Klik item berita idealnya menuju halaman detail (mis. /berita/{slug}) — belum dibuat
 *   di iterasi ini, kabari kalau mau sekalian dibuatkan halaman detailnya.
 */

const PRIMARY_FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const BODY_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

const kategoriGaleri = ["Semua", "Penertiban", "Pembinaan"];

const galeriFoto = [
  { kategori: "Penertiban", caption: "Penertiban jukir tidak berseragam di Alun-alun Singaparna", tanggal: "18 Jul 2026", foto: null },
  { kategori: "Penertiban", caption: "Razia gabungan titik parkir liar Jl. Raya Rajapolah", tanggal: "10 Jul 2026", foto: null },
  { kategori: "Pembinaan", caption: "Pembinaan atribut dan etika juru parkir binaan UPTD", tanggal: "05 Jul 2026", foto: null },
  { kategori: "Pembinaan", caption: "Sosialisasi tarif resmi kepada jukir wilayah Manonjaya", tanggal: "28 Jun 2026", foto: null },
  { kategori: "Penertiban", caption: "Penindakan tarif getok di kawasan Terminal Singaparna", tanggal: "20 Jun 2026", foto: null },
  { kategori: "Pembinaan", caption: "Pembagian atribut rompi & ID Card baru untuk jukir", tanggal: "12 Jun 2026", foto: null },
];

const berita = [
  {
    kategori: "Penertiban",
    tanggal: "18 Jul 2026",
    judul: "Penertiban jukir tidak berseragam di kawasan Alun-alun Singaparna",
    ringkasan: "UPTD bersama petugas gabungan menindak jukir yang tidak memakai atribut resmi.",
  },
  {
    kategori: "Pengumuman",
    tanggal: "12 Jul 2026",
    judul: "Update tarif parkir sepeda motor sesuai Perbup terbaru",
    ringkasan: "Penyesuaian tarif resmi berlaku efektif mulai awal bulan berikutnya.",
  },
  {
    kategori: "Pembinaan",
    tanggal: "05 Jul 2026",
    judul: "Pembinaan rutin atribut dan etika juru parkir binaan UPTD",
    ringkasan: "Kegiatan pembinaan bulanan untuk menjaga standar pelayanan jukir binaan.",
  },
  {
    kategori: "Pengumuman",
    tanggal: "29 Jun 2026",
    judul: "Jadwal pembagian ID Card baru bagi juru parkir binaan",
    ringkasan: "Pembagian dilakukan bertahap per kecamatan mulai pekan depan.",
  },
  {
    kategori: "Penertiban",
    tanggal: "20 Jun 2026",
    judul: "Penindakan praktik tarif getok di Terminal Singaparna",
    ringkasan: "Beberapa oknum diberi peringatan tertulis dan pembinaan lanjutan.",
  },
];

const kategoriBadgeWarna = {
  Penertiban: "bg-red-50 text-red-700",
  Pembinaan: "bg-emerald-50 text-emerald-700",
  Pengumuman: "bg-blue-50 text-blue-700",
};

export default function DokumentasiGaleri() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("galeri"); // 'galeri' | 'berita'
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const fotoTersaring = useMemo(() => {
    if (kategoriAktif === "Semua") return galeriFoto;
    return galeriFoto.filter((f) => f.kategori === kategoriAktif);
  }, [kategoriAktif]);

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
                    item === "Galeri" ? "text-white" : "text-blue-100 hover:text-white"
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
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 px-4 pb-6 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-1.5 text-xs text-blue-200">
            <a href="#" className="hover:text-white">Beranda</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Dokumentasi / Galeri</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl" style={{ fontFamily: PRIMARY_FONT }}>
            Dokumentasi &amp; Berita
          </h1>
          <p className="mt-2 max-w-lg text-sm text-blue-100">
            Dokumentasi kegiatan penertiban, pembinaan, dan pengumuman resmi UPTD
            Pengelola Parkir Kabupaten Tasikmalaya.
          </p>

          {/* Tab switcher */}
          <div className="mt-5 inline-flex rounded-full bg-white/10 p-1">
            <button
              onClick={() => setTab("galeri")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                tab === "galeri" ? "bg-white text-blue-900" : "text-blue-100"
              }`}
            >
              <Camera className="h-3.5 w-3.5" /> Galeri Foto
            </button>
            <button
              onClick={() => setTab("berita")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                tab === "berita" ? "bg-white text-blue-900" : "text-blue-100"
              }`}
            >
              <Newspaper className="h-3.5 w-3.5" /> Berita &amp; Pengumuman
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* ================= TAB: GALERI FOTO ================= */}
        {tab === "galeri" && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {kategoriGaleri.map((k) => (
                <button
                  key={k}
                  onClick={() => setKategoriAktif(k)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    kategoriAktif === k
                      ? "bg-blue-700 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            {fotoTersaring.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {fotoTersaring.map((f) => (
                  <div
                    key={f.caption}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                  >
                    <div className="flex h-32 items-center justify-center bg-slate-100 text-slate-300 sm:h-36">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 p-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${kategoriBadgeWarna[f.kategori]}`}
                      >
                        {f.kategori}
                      </span>
                      <p className="text-xs font-medium leading-snug text-slate-700">{f.caption}</p>
                      <p className="text-[10px] text-slate-400">{f.tanggal}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
                <SearchX className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Belum ada foto pada kategori ini</p>
              </div>
            )}
          </>
        )}

        {/* ================= TAB: BERITA & PENGUMUMAN ================= */}
        {tab === "berita" && (
          <div className="space-y-3">
            {berita.map((b) => (
              <a
                key={b.judul}
                href="#"
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${kategoriBadgeWarna[b.kategori]}`}
                    >
                      {b.kategori}
                    </span>
                    <span className="text-[11px] text-slate-400">{b.tanggal}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{b.judul}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{b.ringkasan}</p>
                </div>
              </a>
            ))}
          </div>
        )}
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
