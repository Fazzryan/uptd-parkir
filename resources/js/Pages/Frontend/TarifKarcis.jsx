import { useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  ScrollText,
  ShieldCheck,
  Bike,
  Car,
  AlertTriangle,
} from "lucide-react";
import Footer from "./Layouts/Footer";

/**
 * Halaman: Tarif Resmi & Contoh Karcis
 * UPTD Pengelola Parkir - Dishubkominfo Kab. Tasikmalaya
 *
 * Sesuai brief:
 * - Tabel tarif parkir manual sesuai Perda Kab. Tasikmalaya yang berlaku
 * - Galeri foto/gambar desain karcis resmi agar warga bisa mencocokkan karcis di lapangan
 *
 * Catatan implementasi (Laravel Inertia):
 * - Data `tarif` sebaiknya diambil dari tabel `tarif_parkir` (props dari Controller) supaya
 *   admin bisa update tanpa deploy ulang saat Perda/Perbup berubah.
 * - Mockup karcis di bawah ini ilustrasi visual (SVG/CSS), belum foto karcis asli.
 *   Begitu ada foto karcis resmi cetak, ganti `<KarcisMock>` dengan <img src="..."> di
 *   dalam TicketCard yang sama supaya bingkai & motifnya tetap konsisten.
 */

const PRIMARY_FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const BODY_FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";

const tarif = [
  { kategori: "Sepeda Motor (Roda 2)", icon: Bike, nominal: "Rp 2.000", satuan: "/ sekali parkir" },
  { kategori: "Mobil (Roda 4)", icon: Car, nominal: "Rp 3.000", satuan: "/ sekali parkir" },
  { kategori: "Bus / Truk", icon: Truck, nominal: "Rp 5.000", satuan: "/ sekali parkir" },
];

const ciriKeamanan = [
  "Logo resmi Pemerintah Kabupaten Tasikmalaya tercetak jelas",
  "Nomor seri unik pada setiap lembar karcis",
  "Mencantumkan nominal tarif resmi sesuai Perda",
  "Dicetak pada kertas thermal / karbon resmi UPTD, bukan kertas biasa",
];

function TicketFrame({ children, className = "" }) {
  return (
    <div className={`relative rounded-2xl bg-white ${className}`}>
      <span className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50" />
      <span className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50" />
      {children}
    </div>
  );
}

function KarcisMock({ kategori, warna, nominal, seri }) {
  return (
    <TicketFrame className="flex flex-col overflow-hidden border border-dashed border-slate-200 shadow-sm">
      <div className={`${warna.bar} px-4 py-2 text-center`}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white">
          Karcis Parkir Resmi
        </p>
      </div>
      <div className="space-y-2 px-4 py-4 text-center">
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          Pemerintah Kabupaten Tasikmalaya
        </p>
        <p className="text-xs font-bold text-slate-700" style={{ fontFamily: PRIMARY_FONT }}>
          UPTD Pengelola Parkir Dishubkominfo
        </p>

        <div className={`mx-auto mt-2 w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${warna.badge}`}>
          {kategori}
        </div>

        <p className="mt-2 text-2xl font-extrabold text-slate-800" style={{ fontFamily: PRIMARY_FONT }}>
          {nominal}
        </p>

        <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-[10px] text-slate-400">
          <span>No. Seri {seri}</span>
          {/* pola qr/barcode ilustratif sebagai fitur keamanan */}
          <span className="grid grid-cols-4 gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 ${i % 3 === 0 ? "bg-slate-700" : "bg-slate-300"}`}
              />
            ))}
          </span>
        </div>
      </div>
    </TicketFrame>
  );
}

export default function TarifKarcis() {
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
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 px-4 pb-10 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-1.5 text-xs text-blue-200">
            <a href="#" className="hover:text-white">Beranda</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Tarif Resmi & Contoh Karcis</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl" style={{ fontFamily: PRIMARY_FONT }}>
            Tarif Resmi &amp; Contoh Karcis
          </h1>
          <p className="mt-2 max-w-lg text-sm text-blue-100">
            Ketahui besaran tarif resmi dan bentuk karcis parkir yang sah, sesuai Perda dan
            Perbup Kabupaten Tasikmalaya.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        {/* ================= TABEL TARIF ================= */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Tarif Retribusi Parkir
            </p>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
              Sesuai Perda &amp; Perbup
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-semibold">Kategori Kendaraan</th>
                  <th className="px-4 py-3 text-right font-semibold">Tarif</th>
                </tr>
              </thead>
              <tbody>
                {tarif.map((t) => (
                  <tr key={t.kategori} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <t.icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="font-medium text-slate-700">{t.kategori}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-blue-900" style={{ fontFamily: PRIMARY_FONT }}>
                        {t.nominal}
                      </span>
                      <span className="ml-1 text-xs text-slate-400">{t.satuan}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-500">
            <ScrollText className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Tarif di atas mengacu pada Peraturan Daerah tentang Retribusi Parkir dan Peraturan
              Bupati Kabupaten Tasikmalaya yang berlaku (nomor &amp; tahun regulasi — menyusul).
              Jukir dilarang menarik tarif melebihi ketentuan ini.
            </p>
          </div>
        </section>

        {/* ================= GALERI CONTOH KARCIS ================= */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
            Contoh Karcis Resmi
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <KarcisMock
              kategori="Roda 2"
              nominal="Rp 2.000"
              seri="0231045"
              warna={{ bar: "bg-blue-700", badge: "bg-blue-50 text-blue-700" }}
            />
            <KarcisMock
              kategori="Roda 4"
              nominal="Rp 3.000"
              seri="0198732"
              warna={{ bar: "bg-orange-600", badge: "bg-orange-50 text-orange-700" }}
            />
            <KarcisMock
              kategori="Bus / Truk"
              nominal="Rp 5.000"
              seri="0087651"
              warna={{ bar: "bg-emerald-700", badge: "bg-emerald-50 text-emerald-700" }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            *Ilustrasi bentuk karcis di atas mewakili elemen resmi yang wajib ada. Foto karcis
            cetak asli akan menggantikan ilustrasi ini.
          </p>
        </section>

        {/* ================= CIRI KEAMANAN ================= */}
        <section className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-700" />
            <p className="text-sm font-bold text-blue-900" style={{ fontFamily: PRIMARY_FONT }}>
              Cocokkan Ciri Keamanan Karcis
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {ciriKeamanan.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-blue-900/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {c}
              </li>
            ))}
          </ul>
        </section>
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
