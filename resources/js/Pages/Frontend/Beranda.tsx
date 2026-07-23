import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    Search,
    MapPin,
    FileText,
    Camera,
    ShieldCheck,
    ChevronRight,
    Ticket,
    Building2,
    ScrollText,
    ArrowUpRight,
    Calendar,
    Images,
    CheckCircle2,
    Receipt,
    Network,
    ArrowRight,
} from "lucide-react";
import {
    Berita,
    GaleriFoto,
    GaleriFotoItem,
    TarifParkirKarcis,
    PanduanJukir,
} from "@/types/model";

interface BerandaProps {
    berita?: Berita[];
    galeri?: GaleriFoto[];
    tarif?: TarifParkirKarcis[];
    panduan?: PanduanJukir[];
    stats?: {
        totalWilayah: number;
        totalTarif: number;
        totalJukir: number;
        totalPersonel: number;
    };
}

const quickMenu = [
    {
        label: "Tarif & Karcis",
        desc: "Tarif resmi retribusi & contoh karcis",
        icon: Ticket,
        href: "/tarif-parkir",
        color: "bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white",
    },
    {
        label: "Panduan Jukir",
        desc: "Ciri-ciri & atribut jukir resmi",
        icon: ShieldCheck,
        href: "/panduan-jukir",
        color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white",
    },
    {
        label: "Wilayah Parkir",
        desc: "Cek titik & lokasi zona parkir",
        icon: MapPin,
        href: "/wilayah-parkir",
        color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-700 hover:text-white",
    },
    {
        label: "Struktur Organisasi",
        desc: "Profil personel & tugas UPTD",
        icon: Network,
        href: "/struktur-organisasi",
        color: "bg-amber-50 text-amber-700 hover:bg-amber-700 hover:text-white",
    },
    {
        label: "Dokumentasi Galeri",
        desc: "Foto kegiatan & penertiban",
        icon: Camera,
        href: "/dokumentasi",
        color: "bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white",
    },
    {
        label: "Berita & Pengumuman",
        desc: "Informasi & pengumuman terbaru",
        icon: FileText,
        href: "/dokumentasi?tab=berita",
        color: "bg-rose-50 text-rose-700 hover:bg-rose-700 hover:text-white",
    },
];

function TicketCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`relative rounded-2xl bg-white ${className}`}>
            <span className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 border-r border-slate-200" />
            <span className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 border-l border-slate-200" />
            {children}
        </div>
    );
}

export default function Beranda({
    berita = [],
    galeri = [],
    tarif = [],
    panduan = [],
    stats = { totalWilayah: 0, totalTarif: 0, totalJukir: 0, totalPersonel: 0 },
}: BerandaProps) {
    const appSettings = usePage<any>().props.app_settings || {};
    const teksHakPengguna =
        appSettings.teks_hak_pengguna_parkir ||
        "Masyarakat berhak menolak membayar retribusi parkir apabila petugas/juru parkir tidak mengenakan seragam atribut resmi atau tidak menyerahkan karcis resmi bercetak Pemerintah Kabupaten Tasikmalaya.";

    const [query, setQuery] = useState("");

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
    };

    const getImageUrl = (path?: string | null) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://"))
            return path;
        return `/storage/${path}`;
    };

    const getPhotoList = (item: GaleriFoto): string[] => {
        if (item.items && Array.isArray(item.items) && item.items.length > 0) {
            return item.items.map((i: GaleriFotoItem) => i.foto);
        }
        if (item.fotos && Array.isArray(item.fotos) && item.fotos.length > 0) {
            return item.fotos;
        }
        if (item.foto) {
            return [item.foto];
        }
        return [];
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.get(route("fe.wilayah-parkir"), { search: query });
        } else {
            router.get(route("fe.wilayah-parkir"));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
            <Head title="UPTD Pengelola Parkir Kab. Tasikmalaya" />

            {/* Header / Navbar Global */}
            <Navbar />

            <div>
                {/* HERO SECTION */}
                <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-800 px-4 pb-16 pt-10 sm:pb-24 sm:pt-14 text-white overflow-hidden">
                    <div className="mx-auto flex flex-col items-center justify-center text-center max-w-4xl relative z-10">
                        <h1 className="max-w-2xl text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl text-white tracking-tight text-center mx-auto">
                            Parkir Resmi, Tertib, dan Transparan untuk
                            Tasikmalaya
                        </h1>
                        <p className="mt-4 max-w-xl text-sm sm:text-base text-blue-100 leading-relaxed font-normal text-center mx-auto">
                            Penyelenggaraan retribusi parkir tepi jalan umum
                            yang tertib, transparan, dan berkeadilan. Pastikan
                            Anda hanya membayar retribusi sesuai tarif Perda
                            kepada juru parkir resmi berkarcis.
                        </p>

                        {/* Fast Stats Row */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                                <span className="block text-xl sm:text-2xl font-extrabold text-white">
                                    {stats.totalWilayah}
                                </span>
                                <span className="text-[11px] text-blue-200 font-medium">
                                    Titik Parkir Resmi
                                </span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                                <span className="block text-xl sm:text-2xl font-extrabold text-white">
                                    {stats.totalTarif}
                                </span>
                                <span className="text-[11px] text-blue-200 font-medium">
                                    Kategori Tarif Resmi
                                </span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                                <span className="block text-xl sm:text-2xl font-extrabold text-white">
                                    {stats.totalJukir}
                                </span>
                                <span className="text-[11px] text-blue-200 font-medium">
                                    Panduan Atribut Jukir
                                </span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
                                <span className="block text-xl sm:text-2xl font-extrabold text-white">
                                    {stats.totalPersonel}
                                </span>
                                <span className="text-[11px] text-blue-200 font-medium">
                                    Personel UPTD Parkir
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="mx-auto -mt-8 max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8 pb-16 relative z-20">
                    {/* HAK MASYARAKAT BANNER (Motif Karcis) */}
                    <TicketCard className="mx-auto flex max-w-4xl items-start gap-4 border border-dashed border-amber-300 bg-amber-50/90 p-5">
                        <div className="text-xs sm:text-sm text-center text-amber-900 leading-relaxed">
                            <span className="font-extrabold text-amber-950">
                                Ketahui Hak Pengguna Parkir:
                            </span>{" "}
                            {teksHakPengguna}{" "}
                            <Link
                                href={route("fe.panduan-jukir")}
                                className="block font-bold underline underline-offset-2 hover:text-amber-700"
                            >
                                Pelajari Ciri Jukir Resmi &rarr;
                            </Link>
                        </div>
                    </TicketCard>

                    {/* SECTION 1: LAYANAN UTAMA */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Layanan &amp; Informasi Utama
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Akses cepat menuju informasi resmi
                                    perparkiran Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                            {quickMenu.map((item) => {
                                const IconComp = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="group flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300"
                                    >
                                        <div
                                            className={`flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl transition-colors ${item.color}`}
                                        >
                                            <IconComp className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                                                    {item.label}
                                                </h3>
                                                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all hidden sm:block" />
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-tight">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 2: TARIF RETRIBUSI PARKNIR RESMI (REAL DATA) */}
                    {tarif.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                        Tarif Retribusi Parkir Resmi
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Besaran tarif retribusi parkir tepi
                                        jalan umum berdasarkan Perda Resmi
                                    </p>
                                </div>
                                <Link
                                    href={route("fe.tarif-parkir")}
                                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 self-start sm:self-auto"
                                >
                                    <span>Lihat Semua</span>
                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {tarif.slice(0, 3).map((t) => {
                                    const jenis =
                                        t.jenis_kendaraan ||
                                        t.kategori_kendaraan ||
                                        "Kendaraan";
                                    const nominal =
                                        t.tarif ?? t.nominal_tarif ?? 0;
                                    const karcisUrl = getImageUrl(
                                        t.contoh_karcis || t.foto,
                                    );
                                    return (
                                        <div
                                            key={t.id}
                                            className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-5 space-y-3 sm:space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all"
                                        >
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 self-start">
                                                        <Receipt className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        {jenis}
                                                    </span>
                                                    <span className="text-sm sm:text-lg font-extrabold text-slate-900">
                                                        {formatRupiah(nominal)}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] sm:text-xs text-slate-600 leading-tight line-clamp-2">
                                                    {t.keterangan ||
                                                        `Tarif retribusi resmi jenis ${jenis}.`}
                                                </p>
                                            </div>

                                            {karcisUrl && (
                                                <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50 h-24 sm:h-36 relative group">
                                                    <img
                                                        src={karcisUrl}
                                                        alt={`Karcis ${jenis}`}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-md">
                                                        Karcis Resmi
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* SECTION 3: PANDUAN JUKIR RESMI (REAL DATA) */}
                    {panduan.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                        Panduan Ciri Juru Parkir Resmi
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Ketahuilah ciri-ciri fisik dan
                                        kelengkapan juru parkir binaan UPTD
                                    </p>
                                </div>
                                <Link
                                    href={route("fe.panduan-jukir")}
                                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 self-start sm:self-auto"
                                >
                                    <span>Lihat Panduan Lengkap</span>
                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {panduan.map((p) => {
                                    const fotoUrl = getImageUrl(p.foto);
                                    return (
                                        <div
                                            key={p.id}
                                            className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 space-y-2 sm:space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-all"
                                        >
                                            {fotoUrl ? (
                                                <div className="h-28 sm:h-40 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100 relative">
                                                    <img
                                                        src={fotoUrl}
                                                        alt={
                                                            p.judul ||
                                                            p.teks_info
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-20 sm:h-28 w-full rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                                    <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                                    {p.judul || p.teks_info}
                                                </h3>
                                                {p.deskripsi && (
                                                    <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-tight">
                                                        {p.deskripsi}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* SECTION 4: BERITA & PENGUMUMAN TERKINI (REAL DATA) */}
                    {berita.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                        Berita &amp; Pengumuman Terbaru
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Kabar kegiatan, himbauan, dan informasi
                                        publik UPTD Parkir
                                    </p>
                                </div>
                                <Link
                                    href={route("fe.dokumentasi")}
                                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 self-start sm:self-auto"
                                >
                                    <span>Lihat Semua Berita</span>
                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                                {berita.map((b) => {
                                    const fotoUrl = getImageUrl(b.foto);
                                    return (
                                        <Link
                                            key={b.id}
                                            href={route(
                                                "fe.berita.detail",
                                                b.id,
                                            )}
                                            className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-5 transition-all hover:border-blue-300"
                                        >
                                            <div className="space-y-2 sm:space-y-3">
                                                {fotoUrl && (
                                                    <div className="h-28 sm:h-40 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100 relative">
                                                        <img
                                                            src={fotoUrl}
                                                            alt={b.judul}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>
                                                )}

                                                <div className="space-y-1 sm:space-y-2">
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                        <span className="rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                            {b.kategori ||
                                                                "Berita"}
                                                        </span>
                                                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(
                                                                b.tanggal,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                                                        {b.judul}
                                                    </h3>

                                                    {b.ringkasan && (
                                                        <p className="text-[10px] sm:text-xs text-slate-600 line-clamp-2 leading-tight hidden sm:block">
                                                            {b.ringkasan}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-2 sm:pt-4 flex items-center text-[11px] sm:text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                                                <span>Baca Selengkapnya</span>
                                                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* SECTION 5: DOKUMENTASI GALERI (REAL DATA) */}
                    {galeri.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                        Dokumentasi Kegiatan Terbaru
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Foto penertiban, sosialisasi, dan
                                        pembinaan juru parkir di lapangan
                                    </p>
                                </div>
                                <Link
                                    href={route("fe.dokumentasi")}
                                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 self-start sm:self-auto"
                                >
                                    <span>Lihat Semua Galeri</span>
                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {galeri.map((item) => {
                                    const photoList = getPhotoList(item);
                                    const mainPhotoUrl =
                                        photoList.length > 0
                                            ? getImageUrl(photoList[0])
                                            : null;

                                    return (
                                        <Link
                                            key={item.id}
                                            href={route("fe.dokumentasi")}
                                            className="group rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 transition-all hover:border-purple-300 space-y-2 sm:space-y-3"
                                        >
                                            <div className="h-28 sm:h-44 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100 relative">
                                                {mainPhotoUrl ? (
                                                    <img
                                                        src={mainPhotoUrl}
                                                        alt={item.caption}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-purple-50 text-purple-600">
                                                        <Camera className="h-6 w-6 sm:h-8 sm:w-8" />
                                                    </div>
                                                )}

                                                {photoList.length > 1 && (
                                                    <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                                                        <Images className="h-3 w-3" />
                                                        {photoList.length} Foto
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-0.5 sm:space-y-1">
                                                <span className="text-[9px] sm:text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                                                    {item.kategori ||
                                                        "Kegiatan"}
                                                </span>
                                                <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
                                                    {item.caption}
                                                </p>
                                                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                                                    {formatDate(item.tanggal)}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* SECTION 6: CTA WILAYAH PARKIR */}
                    <section className="flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 p-6 sm:p-8 text-white sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                                Peta &amp; Titik Parkir Resmi
                            </span>
                            <h3 className="text-lg sm:text-xl font-extrabold text-white">
                                Temukan titik parkir resmi di seluruh Kabupaten
                                Tasikmalaya
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                                Cari tahu alamat lokasi titik parkir resmi,
                                kecamatan, serta kapasitas daya tampung
                                kendaraan di area sekitar Anda.
                            </p>
                        </div>
                        <Link
                            href={route("fe.wilayah-parkir")}
                            className="flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-3 text-xs sm:text-sm font-extrabold text-white hover:opacity-90 transition shadow-md active:scale-95"
                        >
                            <MapPin className="h-4 w-4" />
                            <span>Lihat Zona</span>
                        </Link>
                    </section>
                </main>
            </div>

            {/* Footer Global dengan Visitor Stats & Floating WhatsApp */}
            <Footer />
        </div>
    );
}
