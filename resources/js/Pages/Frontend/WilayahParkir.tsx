import React, { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import SeoHead from "@/Components/SeoHead";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    ChevronRight,
    Search,
    ShieldCheck,
    Navigation,
    SearchX,
    MapPin,
    MessageCircle,
    Building2,
} from "lucide-react";
import { WilayahParkir as WilayahParkirType } from "@/types/model";

interface WilayahParkirProps {
    wilayahParkir: WilayahParkirType[];
}

export default function WilayahParkir({
    wilayahParkir = [],
}: WilayahParkirProps) {
    const [query, setQuery] = useState("");

    const waNumber = "6281234567890";
    const waMessage = encodeURIComponent(
        "Halo UPTD Parkir Kab. Tasikmalaya, saya ingin membuat laporan.\n#Nama: \n#Lokasi Kejadian: \n#Jenis Pelanggaran (Tarif Getok/Jukir Liar/Tanpa Karcis): \n#Bukti Foto/Video: ",
    );

    const hasil = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return wilayahParkir;
        return wilayahParkir.filter((item) => {
            const namaKecamatan = item.kecamatan?.nama_kecamatan || "";
            return (
                item.nama_jalan.toLowerCase().includes(q) ||
                namaKecamatan.toLowerCase().includes(q)
            );
        });
    }, [query, wilayahParkir]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <SeoHead
                title="Wilayah Parkir Resmi - UPTD Parkir Kab. Tasikmalaya"
                description="Daftar lokasi dan titik wilayah parkir resmi yang dikelola oleh UPTD Pengelola Parkir Dinas Perhubungan Kabupaten Tasikmalaya."
                keywords="Wilayah Parkir Tasikmalaya, Titik Parkir Resmi, Lokasi Parkir Tasikmalaya, Dishub Tasikmalaya"
            />

            <Navbar />

            <section className="relative pt-16 pb-16 lg:pb-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 overflow-hidden text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-70"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-200 mb-4">
                        <Link
                            href={route("fe.beranda")}
                            className="hover:text-white transition-colors"
                        >
                            Beranda
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-blue-300" />
                        <span className="text-white font-semibold">
                            Wilayah Parkir Resmi
                        </span>
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
                            Wilayah Parkir Resmi
                        </h1>
                        <p className="text-base sm:text-lg text-white leading-relaxed">
                            Cek daftar lokasi &amp; titik area jalan yang resmi
                            dikelola oleh UPTD Pengelola Parkir Kabupaten
                            Tasikmalaya.
                        </p>
                    </div>
                </div>
            </section>

            <div className="sticky top-[58px] z-30 bg-slate-50/95 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur supports-[backdrop-filter]:bg-slate-50/90">
                <div className="mx-auto max-w-7xl md:px-8">
                    {/* Input Pencarian */}
                    <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <Search className="h-4 w-4 shrink-0 text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            type="text"
                            placeholder="Cari nama jalan atau kecamatan..."
                            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-900">
                            {hasil.length}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-900">
                            {wilayahParkir.length}
                        </span>{" "}
                        titik parkir resmi
                    </p>
                </div>

                {/* DAFTAR ZONA / TITIK PARKIR */}
                {hasil.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {hasil.map((z) => {
                            const mapsUrl =
                                z.latitude && z.longitude
                                    ? `https://www.google.com/maps/search/?api=1&query=${z.latitude},${z.longitude}`
                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                          `${z.nama_jalan}, ${z.kecamatan?.nama_kecamatan || ""}, Kabupaten Tasikmalaya`,
                                      )}`;

                            return (
                                <div
                                    key={z.id}
                                    className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 transition-all hover:border-blue-200 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                                                {z.nama_jalan}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                <span>
                                                    Kecamatan:{" "}
                                                    {z.kecamatan
                                                        ?.nama_kecamatan || "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            <span>Titik Resmi UPTD</span>
                                        </span>

                                        <a
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-blue-700 transition-colors"
                                        >
                                            <Navigation className="h-3.5 w-3.5" />
                                            <span>Petunjuk Lokasi</span>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center px-4">
                        <div className="p-4 rounded-full bg-slate-50 text-slate-400">
                            <SearchX className="h-8 w-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">
                            Titik Parkir Tidak Ditemukan
                        </h3>
                        <p className="max-w-md text-xs sm:text-sm text-slate-500">
                            Coba kata kunci pencarian lain, atau pilih "Semua
                            Kecamatan" pada filter di atas.
                        </p>
                    </div>
                )}

                {/* LAPOR JIKALAU TIDAK ADA DI DAFTAR */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-dashed border-amber-300 bg-amber-50/80 p-6">
                    <div className="space-y-1">
                        <h4 className="text-base font-bold text-amber-900">
                            Lokasi Parkir Tidak Ada Dalam Daftar?
                        </h4>
                        <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                            Jika Anda menemukan oknum yang memungut tarif parkir
                            di lokasi selain titik resmi di atas, indikasi kuat
                            hal tersebut adalah{" "}
                            <span className="font-bold underline">
                                jukir liar
                            </span>
                            .
                        </p>
                    </div>
                    <a
                        href={`https://wa.me/${waNumber}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-2xl bg-amber-500 hover:bg-amber-600 px-5 py-3 text-xs font-bold text-white transition-colors shadow-xs"
                    >
                        Laporkan Jukir Liar
                    </a>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <Footer />
        </div>
    );
}
