import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import SeoHead from "@/Components/SeoHead";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    ChevronRight,
    ShieldAlert,
    ShieldCheck,
    Ticket,
    MessageCircle,
    Info,
    X,
    ZoomIn,
} from "lucide-react";
import { PanduanJukir as PanduanJukirType } from "@/types/model";

interface PanduanJukirProps {
    panduanJukir: PanduanJukirType[];
}

const checklistData = [
    "Petugas memakai rompi & topi resmi berlogo UPTD",
    "Bersedia menunjukkan ID Card saat diminta",
    "Memberikan karcis resmi bertanda Pemkab Tasikmalaya",
];

const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("/")
    ) {
        return path;
    }
    return `/storage/${path}`;
};

export default function PanduanJukir({ panduanJukir = [] }: PanduanJukirProps) {
    const [selectedPanduan, setSelectedPanduan] = useState<PanduanJukirType | null>(null);
    const appSettings = usePage<any>().props.app_settings || {};
    const teksHakPengguna =
        appSettings.teks_hak_pengguna_parkir ||
        "Masyarakat berhak menolak membayar retribusi parkir apabila petugas/juru parkir tidak mengenakan seragam atribut resmi atau tidak menyerahkan karcis resmi bercetak Pemerintah Kabupaten Tasikmalaya.";
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <SeoHead
                title="Panduan & Kode Etik Juru Parkir - UPTD Parkir Kab. Tasikmalaya"
                description="Panduan pelayanan standar, atribut resmi, serta kode etik bertugas juru parkir resmi Kabupaten Tasikmalaya."
                keywords="Panduan Jukir, Juru Parkir Tasikmalaya, Atribut Jukir Resmi, Hak Pengguna Parkir"
            />

            <Navbar />

            {/* ================= PAGE HEADER / HERO ================= */}
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
                            Panduan Jukir
                        </span>
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
                            Kenali Juru Parkir Resmi
                        </h1>
                        <p className="text-base sm:text-lg text-white leading-relaxed">
                            Atribut dan kelengkapan wajib yang harus dikenakan
                            oleh juru parkir binaan UPTD Pengelola Parkir
                            Kabupaten Tasikmalaya saat bertugas di lapangan.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Atribut Section (Zig-Zag Vertical Cards Tanpa Background Section) */}
                <section className="space-y-8">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            Atribut Resmi Jukir
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                            Kelengkapan Tugas Juru Parkir
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Pastikan juru parkir yang melayani Anda di lapangan
                            mengenakan atribut &amp; kelengkapan resmi berikut
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {panduanJukir && panduanJukir.length > 0 ? (
                            panduanJukir.map((item, index) => {
                                const imageUrl = getImageUrl(item.foto);

                                return (
                                    <div
                                        key={item.id || index}
                                        className="group flex flex-col sm:flex-row gap-5 items-start sm:items-center p-6 rounded-3xl bg-white border border-slate-100 transition-all hover:border-blue-200 hover:shadow-xs"
                                    >
                                        {/* Gambar Atribut */}
                                        <div
                                            onClick={() =>
                                                imageUrl && setSelectedPanduan(item)
                                            }
                                            className={`w-full aspect-[3/2] sm:aspect-square sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative transition-colors ${
                                                imageUrl
                                                    ? "cursor-pointer"
                                                    : ""
                                            }`}
                                        >
                                            {imageUrl && (
                                                <>
                                                    <img
                                                        src={imageUrl}
                                                        alt={
                                                            item.teks_info ||
                                                            item.judul ||
                                                            "Panduan Jukir"
                                                        }
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display =
                                                                "none";
                                                            e.currentTarget.nextElementSibling?.classList.remove(
                                                                "hidden",
                                                            );
                                                        }}
                                                    />
                                                    {/* Hover Overlay Zoom Icon */}
                                                    <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <div className="h-9 w-9 rounded-full bg-white/90 text-blue-900 flex items-center justify-center shadow-md">
                                                            <ZoomIn className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div
                                                className={`${
                                                    imageUrl ? "hidden" : "flex"
                                                } absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-3 text-center`}
                                            >
                                                <Info className="h-6 w-6 mb-1 text-slate-400" />
                                                <span className="text-[11px] font-medium">
                                                    Foto {item.teks_info || item.judul}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Konten Teks Atribut */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-600/30">
                                                    {index + 1}
                                                </span>
                                                <h3
                                                    onClick={() =>
                                                        imageUrl && setSelectedPanduan(item)
                                                    }
                                                    className={`text-lg font-bold text-slate-900 transition-colors ${
                                                        imageUrl
                                                            ? "cursor-pointer hover:text-blue-700"
                                                            : ""
                                                    }`}
                                                >
                                                    {item.teks_info || item.judul}
                                                </h3>
                                            </div>
                                            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                                                {item.deskripsi}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
                                <Info className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                <p className="text-sm font-medium">
                                    Data panduan jukir belum tersedia.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Penegasan Hak Masyarakat Card (Desain Imbauan & Peringatan) */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/50 border-2 border-amber-300/80 p-6 sm:p-10 text-center shadow-lg shadow-amber-500/10">
                    {/* Hiasan background & glow */}
                    <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-orange-400/20 blur-3xl" />

                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-4">
                        {/* Icon Badge Peringatan */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 border border-orange-400/40 text-orange-800 text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm shadow-xs">
                            <ShieldAlert className="h-4 w-4 text-orange-600 shrink-0" />
                            <span>Imbauan Resmi Hak Masyarakat</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
                            "{teksHakPengguna}"
                        </h2>
                    </div>
                </section>
            </main>

            {/* ================= LIGHTBOX MODAL PREVIEW ================= */}
            {selectedPanduan && (
                <div
                    onClick={() => setSelectedPanduan(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6 sm:p-8"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedPanduan(null)}
                            className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Modal Image Container */}
                        <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-[50vh] sm:h-[60vh] flex items-center justify-center">
                            {getImageUrl(selectedPanduan.foto) ? (
                                <img
                                    src={
                                        getImageUrl(
                                            selectedPanduan.foto,
                                        ) as string
                                    }
                                    alt={
                                        selectedPanduan.teks_info ||
                                        selectedPanduan.judul ||
                                        "Preview"
                                    }
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                                    <Info className="h-12 w-12 text-slate-500" />
                                    <span className="text-xs font-medium text-slate-400">
                                        Foto preview belum diunggah
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Modal Info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-block rounded-full px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                    Atribut Resmi Jukir
                                </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                {selectedPanduan.teks_info ||
                                    selectedPanduan.judul}
                            </h3>
                            {selectedPanduan.deskripsi && (
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {selectedPanduan.deskripsi}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
