import React, { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import SeoHead from "@/Components/SeoHead";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
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
    LayoutGrid,
    Table as TableIcon,
    Users,
    UserX,
} from "lucide-react";
import { WilayahParkir as WilayahParkirType, Jukir } from "@/types/model";

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
            const jukirMatch = item.jukir?.some(
                (j) =>
                    j.nama.toLowerCase().includes(q) ||
                    (j.kode_jukir && j.kode_jukir.toLowerCase().includes(q))
            );
            return (
                item.nama_jalan.toLowerCase().includes(q) ||
                namaKecamatan.toLowerCase().includes(q) ||
                jukirMatch
            );
        });
    }, [query, wilayahParkir]);

    // toggle grid atau tabel
    const [view, setView] = useState("table");

    // Helper URL Google Maps
    const getMapsUrl = (z: WilayahParkirType) => {
        return z.latitude && z.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${z.latitude},${z.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${z.nama_jalan}, ${z.kecamatan?.nama_kecamatan || ""}, Kabupaten Tasikmalaya`,
              )}`;
    };

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
                            placeholder="Cari titik lokasi, kecamatan, atau nama juru parkir..."
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
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant={view === "grid" ? "primary" : "secondary"}
                            onClick={() => setView("grid")}
                            className={`!rounded-lg !px-3 !py-2 ${
                                view === "grid"
                                    ? "!bg-blue-600 hover:!bg-blue-700 text-white"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                            title="Tampilan Grid"
                            aria-label="Tampilan Grid"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={view === "table" ? "primary" : "secondary"}
                            onClick={() => setView("table")}
                            className={`!rounded-lg !px-3 !py-2 ${
                                view === "table"
                                    ? "!bg-blue-600 hover:!bg-blue-700 text-white"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                            title="Tampilan Tabel"
                            aria-label="Tampilan Tabel"
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* DAFTAR ZONA / TITIK PARKIR */}
                {hasil.length > 0 ? (
                    view === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {hasil.map((z) => {
                                const mapsUrl = getMapsUrl(z);
                                const jukirList = z.jukir || [];

                                return (
                                    <div
                                        key={z.id}
                                        className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 transition-all hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 group"
                                    >
                                        <div className="space-y-3">
                                            {/* Header Titik Lokasi & Kecamatan */}
                                            <div className="space-y-1">
                                                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                                                    {z.nama_jalan}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                                                    <span>
                                                        Kecamatan:{" "}
                                                        <strong className="text-slate-700 font-semibold">
                                                            {z.kecamatan?.nama_kecamatan || "-"}
                                                        </strong>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Informasi Juru Parkir */}
                                            <div className="pt-3 border-t border-slate-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                                        <Users className="h-3 w-3 text-blue-600" />
                                                        Juru Parkir Resmi
                                                    </span>
                                                    {jukirList.length > 0 && (
                                                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                            {jukirList.length} Jukir
                                                        </span>
                                                    )}
                                                </div>

                                                {jukirList.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {jukirList.map((j) => (
                                                            <Badge
                                                                key={j.id}
                                                                type="info"
                                                                className="!normal-case !tracking-normal font-semibold text-xs py-1 px-2.5 bg-blue-50 text-blue-700 border-blue-200/80 shadow-2xs"
                                                            >
                                                                {j.nama}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-slate-50 text-slate-400 text-xs italic">
                                                        <UserX className="h-3.5 w-3.5 shrink-0" />
                                                        <span>Belum ada jukir terdaftar</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100">
                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3.5 py-2 text-xs font-bold text-blue-700 transition-colors"
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
                        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50/80">
                                            <th className="py-3.5 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-14 text-center shrink-0">
                                                No
                                            </th>
                                            <th className="py-3.5 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-64 md:w-72">
                                                Titik Lokasi
                                            </th>
                                            <th className="py-3.5 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-40 md:w-48 whitespace-nowrap">
                                                Kecamatan
                                            </th>
                                            <th className="py-3.5 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider min-w-[200px]">
                                                Juru Parkir Resmi
                                            </th>
                                            <th className="py-3.5 px-5 text-center text-xs font-bold text-slate-700 uppercase tracking-wider w-44 shrink-0 whitespace-nowrap">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {hasil.map((z, index) => {
                                            const mapsUrl = getMapsUrl(z);
                                            const jukirList = z.jukir || [];

                                            return (
                                                <tr
                                                    key={z.id}
                                                    className="hover:bg-slate-50/70 transition-colors"
                                                >
                                                    <td className="py-3.5 px-5 font-semibold text-slate-900 text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-3.5 px-5 font-bold text-slate-900 max-w-xs break-words">
                                                        {z.nama_jalan}
                                                    </td>
                                                    <td className="py-3.5 px-5 text-slate-600 font-medium whitespace-nowrap">
                                                        {z.kecamatan
                                                            ?.nama_kecamatan ||
                                                            "-"}
                                                    </td>
                                                    <td className="py-3.5 px-5">
                                                        {jukirList.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                                {jukirList.map((j) => (
                                                                    <Badge
                                                                        key={j.id}
                                                                        type="info"
                                                                        className="!normal-case !tracking-normal font-semibold text-xs py-1 px-2.5 bg-blue-50 text-blue-700 border-blue-200/80 shadow-2xs whitespace-nowrap"
                                                                    >
                                                                        {j.nama}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic flex items-center gap-1.5 whitespace-nowrap">
                                                                <UserX className="h-3.5 w-3.5 shrink-0" />
                                                                Belum ada jukir
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
                                                        <a
                                                            href={mapsUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex transition-transform hover:scale-105"
                                                        >
                                                            <Badge
                                                                type="info"
                                                                className="!normal-case !tracking-normal font-semibold text-xs py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200/80 inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                                                            >
                                                                <Navigation className="h-3.5 w-3.5 shrink-0" />
                                                                <span className="whitespace-nowrap">Petunjuk Lokasi</span>
                                                            </Badge>
                                                        </a>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
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
