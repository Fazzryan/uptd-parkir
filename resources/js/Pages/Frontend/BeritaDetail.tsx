import React from "react";
import { Link } from "@inertiajs/react";
import SeoHead from "@/Components/SeoHead";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    ChevronRight,
    Calendar,
    ArrowLeft,
    Tag,
    Share2,
    MessageCircle,
    FileText,
    ExternalLink,
} from "lucide-react";
import { Berita } from "@/types/model";

interface BeritaDetailProps {
    berita: Berita;
    beritaTerkait?: Berita[];
}

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

const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const kategoriBadgeWarna: Record<string, string> = {
    Penertiban: "bg-red-50 text-red-700 border-red-200",
    Pembinaan: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pengumuman: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function BeritaDetail({
    berita,
    beritaTerkait = [],
}: BeritaDetailProps) {
    const photoUrl = getImageUrl(berita.foto);
    const waNumber = "6281234567890";
    const waMessage = encodeURIComponent(
        `Halo UPTD Parkir, saya ingin bertanya tentang berita: "${berita.judul}"`,
    );

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = encodeURIComponent(
        `${berita.judul}\n\nBaca selengkapnya di UPTD Parkir Kab. Tasikmalaya:`,
    );

    const formattedDate = formatDate(berita.tanggal);

    const cleanDescription = berita.ringkasan
        ? berita.ringkasan.replace(/<[^>]*>?/gm, "").substring(0, 160)
        : (berita.isi ? berita.isi.replace(/<[^>]*>?/gm, "").substring(0, 160) : berita.judul);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <SeoHead
                title={`${berita.judul} - UPTD Parkir Kab. Tasikmalaya`}
                description={cleanDescription}
                keywords={`Berita UPTD Parkir, ${berita.kategori || 'Berita'}, Tasikmalaya, ${berita.judul}`}
                schemaJsonLd={{
                    "@context": "https://schema.org",
                    "@type": "NewsArticle",
                    "headline": berita.judul,
                    "datePublished": berita.tanggal,
                    "description": cleanDescription,
                    "author": {
                        "@type": "Organization",
                        "name": "UPTD Pengelola Parkir Kab. Tasikmalaya"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "UPTD Pengelola Parkir Kab. Tasikmalaya"
                    }
                }}
            />

            <Navbar />

            {/* ================= PAGE HEADER / HERO ================= */}
            <section className="relative pt-10 pb-12 lg:pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 overflow-hidden text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-70"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs & Back Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-blue-200">
                            <Link
                                href={route("fe.beranda")}
                                className="hover:text-white transition-colors"
                            >
                                Beranda
                            </Link>
                            <ChevronRight className="h-3.5 w-3.5 text-blue-300" />
                            <Link
                                href={route("fe.dokumentasi")}
                                className="hover:text-white transition-colors"
                            >
                                Dokumentasi & Berita
                            </Link>
                            <ChevronRight className="h-3.5 w-3.5 text-blue-300" />
                            <span className="text-white font-semibold truncate max-w-[200px]">
                                Detail Berita
                            </span>
                        </div>

                        <Link
                            href={route("fe.dokumentasi")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur transition-all"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Kembali ke Dokumentasi</span>
                        </Link>
                    </div>

                    {/* Meta Badge & Date */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-white/10 text-blue-100 border-blue-400/30 backdrop-blur`}
                        >
                            <Tag className="h-3 w-3" />
                            {berita.kategori || "Berita"}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-blue-200">
                            <Calendar className="h-3.5 w-3.5 text-blue-300" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    {/* Judul Artikel */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        {berita.judul}
                    </h1>

                    {berita.ringkasan && (
                        <p className="mt-4 text-sm sm:text-base text-blue-100 leading-relaxed max-w-3xl">
                            {berita.ringkasan}
                        </p>
                    )}
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 lg:p-10 space-y-8">
                    {/* Header Image */}
                    {photoUrl ? (
                        <div className="overflow-hidden max-h-[450px]">
                            <img
                                src={photoUrl}
                                alt={berita.judul}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-56 sm:h-72 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <div className="flex flex-col items-center gap-2">
                                <FileText className="h-10 w-10 text-slate-300" />
                                <span className="text-xs font-medium text-slate-400">
                                    Foto dokumentasi berita tidak tersedia
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Body Text */}
                    <div className="prose prose-slate max-w-none text-sm prose-p:leading-relaxed prose-p:text-slate-700 prose-headings:font-bold prose-headings:text-slate-900">
                        {berita.isi ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: berita.isi }}
                            />
                        ) : (
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                {berita.ringkasan ||
                                    "Tidak ada detail konten tambahan."}
                            </p>
                        )}
                    </div>

                    {/* Social Share Bar */}
                    <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Share2 className="h-4 w-4 text-blue-700" />
                            <span>Bagikan Informasi Ini:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* ================= BERITA TERKAIT ================= */}
                {beritaTerkait.length > 0 && (
                    <section className="mt-12 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                Berita & Pengumuman Lainnya
                            </h2>
                            <Link
                                href={route("fe.dokumentasi")}
                                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                            >
                                <span>Lihat Semua</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {beritaTerkait.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route("fe.berita.detail", item.id)}
                                    className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                                    kategoriBadgeWarna[
                                                        item.kategori
                                                    ] ||
                                                    "bg-blue-50 text-blue-700 border-blue-100"
                                                }`}
                                            >
                                                {item.kategori}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-400">
                                                {formatDate(item.tanggal)}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                                            {item.judul}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {item.ringkasan}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                                        <span>Baca Selengkapnya</span>
                                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* ================= FOOTER ================= */}
            <Footer />
        </div>
    );
}
