import React, { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import SeoHead from "@/Components/SeoHead";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    ChevronRight,
    Camera,
    Newspaper,
    FileText,
    SearchX,
    MessageCircle,
    X,
    Calendar,
    Tag,
    ZoomIn,
    ArrowUpRight,
    ChevronLeft,
    Images,
} from "lucide-react";
import { GaleriFoto, Berita, PaginatedData } from "@/types/model";
import Pagination from "@/Components/Data/Pagination";

interface DokumentasiGaleriProps {
    galeriFoto?: PaginatedData<GaleriFoto> | GaleriFoto[];
    berita?: PaginatedData<Berita> | Berita[];
}



const kategoriBadgeWarna: Record<string, string> = {
    Penertiban: "bg-red-50 text-red-700 border-red-100",
    Pembinaan: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pengumuman: "bg-blue-50 text-blue-700 border-blue-100",
};

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

const getPhotoList = (item?: any): string[] => {
    if (!item) return [];
    let list: string[] = [];
    if (item.items && Array.isArray(item.items) && item.items.length > 0) {
        list = item.items.map((i: any) => i.foto);
    } else if (
        item.fotos &&
        Array.isArray(item.fotos) &&
        item.fotos.length > 0
    ) {
        list = item.fotos;
    } else if (item.foto) {
        try {
            const parsed = JSON.parse(item.foto);
            if (Array.isArray(parsed) && parsed.length > 0) {
                list = parsed;
            } else {
                list = [item.foto];
            }
        } catch (e) {
            list = [item.foto];
        }
    }
    return list;
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

export default function DokumentasiGaleri({
    galeriFoto,
    berita,
}: DokumentasiGaleriProps) {
    const isGaleriPaginated = galeriFoto && "data" in galeriFoto;
    const isBeritaPaginated = berita && "data" in berita;

    const listGaleri: GaleriFoto[] = useMemo(() => {
        if (!galeriFoto) return [];
        if ("data" in galeriFoto) {
            return galeriFoto.data;
        }
        return galeriFoto;
    }, [galeriFoto]);

    const listBerita: Berita[] = useMemo(() => {
        if (!berita) return [];
        if ("data" in berita) {
            return berita.data;
        }
        return berita;
    }, [berita]);

    const [tab, setTab] = useState<"galeri" | "berita">(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("tab") === "berita" || params.has("berita_page")) {
                return "berita";
            }
        }
        return "galeri";
    });
    const [kategoriAktif, setKategoriAktif] = useState("Semua");

    // Lightbox modal state
    const [selectedItem, setSelectedItem] = useState<GaleriFoto | null>(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

    const activePhotoList = useMemo(() => {
        return getPhotoList(selectedItem);
    }, [selectedItem]);

    // Kategori dinamis dari data galeri
    const kategoriGaleri = useMemo(() => {
        const setKategori = new Set<string>();
        listGaleri.forEach((item) => {
            if (item.kategori) setKategori.add(item.kategori);
        });
        return ["Semua", ...Array.from(setKategori)];
    }, [listGaleri]);

    const fotoTersaring = useMemo(() => {
        if (kategoriAktif === "Semua") return listGaleri;
        return listGaleri.filter((f) => f.kategori === kategoriAktif);
    }, [kategoriAktif, listGaleri]);

    const openModal = (item: GaleriFoto) => {
        setSelectedItem(item);
        setActivePhotoIndex(0);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setActivePhotoIndex(0);
    };

    const handlePrev = () => {
        if (activePhotoList.length <= 1) return;
        setActivePhotoIndex((prev) =>
            prev > 0 ? prev - 1 : activePhotoList.length - 1,
        );
    };

    const handleNext = () => {
        if (activePhotoList.length <= 1) return;
        setActivePhotoIndex((prev) =>
            prev < activePhotoList.length - 1 ? prev + 1 : 0,
        );
    };

    const waNumber = "6281234567890";
    const waMessage = encodeURIComponent(
        "Halo UPTD Parkir Kab. Tasikmalaya, saya ingin membuat laporan.\n#Nama: \n#Lokasi Kejadian: \n#Jenis Pelanggaran (Tarif Getok/Jukir Liar/Tanpa Karcis): \n#Bukti Foto/Video: ",
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <SeoHead
                title="Dokumentasi & Berita - UPTD Parkir Kab. Tasikmalaya"
                description="Kumpulan berita terkini, pengumuman resmi, dan galeri foto kegiatan UPTD Pengelola Parkir Dinas Perhubungan Kabupaten Tasikmalaya."
                keywords="Berita UPTD Parkir, Galeri Foto Parkir, Pengumuman Dishub Tasikmalaya, Berita Tasikmalaya"
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
                            Dokumentasi &amp; Berita
                        </span>
                    </div>

                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                            Dokumentasi &amp; Berita
                        </h1>
                        <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
                            Galeri foto kegiatan penertiban, pembinaan juru
                            parkir, serta berita dan pengumuman resmi UPTD
                            Pengelola Parkir Kabupaten Tasikmalaya.
                        </p>

                        {/* Tab Switcher */}
                        <div className="pt-4 flex items-center gap-2">
                            <div className="inline-flex rounded-2xl bg-white/10 p-1.5 backdrop-blur ring-1 ring-white/10">
                                <button
                                    onClick={() => setTab("galeri")}
                                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                                        tab === "galeri"
                                            ? "bg-white text-blue-900 shadow-md"
                                            : "text-blue-100 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <Camera className="h-4 w-4" />
                                    <span>Galeri Foto</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                                            tab === "galeri"
                                                ? "bg-blue-100 text-blue-900"
                                                : "bg-white/10 text-white"
                                        }`}
                                    >
                                        {listGaleri.length}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setTab("berita")}
                                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                                        tab === "berita"
                                            ? "bg-white text-blue-900 shadow-md"
                                            : "text-blue-100 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <Newspaper className="h-4 w-4" />
                                    <span>Berita &amp; Pengumuman</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                                            tab === "berita"
                                                ? "bg-blue-100 text-blue-900"
                                                : "bg-white/10 text-white"
                                        }`}
                                    >
                                        {listBerita.length}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {/* ================= TAB 1: GALERI FOTO ================= */}
                {tab === "galeri" && (
                    <section className="space-y-6">
                        {/* Filter Kategori Badges */}
                        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/80 pb-4">
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {kategoriGaleri.map((k) => (
                                    <button
                                        key={k}
                                        onClick={() => setKategoriAktif(k)}
                                        className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                                            kategoriAktif === k
                                                ? "bg-blue-700 text-white shadow-xs"
                                                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        {k}
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                                Total {isGaleriPaginated ? galeriFoto.total : fotoTersaring.length} Foto Kegiatan
                            </span>
                        </div>

                        {/* Grid Foto Kegiatan */}
                        {fotoTersaring.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fotoTersaring.map((item) => {
                                    const photoList = getPhotoList(item);
                                    const mainPhotoUrl =
                                        photoList.length > 0
                                            ? getImageUrl(photoList[0])
                                            : null;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => openModal(item)}
                                            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-blue-200 cursor-pointer"
                                        >
                                            {/* Photo Container */}
                                            <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-2xl bg-slate-100">
                                                {mainPhotoUrl ? (
                                                    <img
                                                        src={mainPhotoUrl}
                                                        alt={item.caption}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                                                        <Camera className="h-10 w-10 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                                                    </div>
                                                )}

                                                {/* Hover Overlay Zoom Icon */}
                                                <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="h-10 w-10 rounded-full bg-white/90 text-blue-900 flex items-center justify-center shadow-md">
                                                        <ZoomIn className="h-5 w-5" />
                                                    </div>
                                                </div>

                                                {/* Category Badge Floating (Kiri Atas) */}
                                                <div className="absolute top-3 left-3">
                                                    <span
                                                        className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold border backdrop-blur-md ${
                                                            kategoriBadgeWarna[
                                                                item.kategori
                                                            ] ||
                                                            "bg-blue-50 text-blue-700 border-blue-100"
                                                        }`}
                                                    >
                                                        {item.kategori}
                                                    </span>
                                                </div>

                                                {/* Total Photos Badge Floating (Kanan Atas) */}
                                                {photoList.length > 1 && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                                                            <Images className="h-3 w-3" />
                                                            {photoList.length}{" "}
                                                            Foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Caption & Date */}
                                            <div className="mt-4 space-y-2 px-1">
                                                <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                                                    {item.caption}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    <span>
                                                        {formatDate(
                                                            item.tanggal,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center px-4">
                                <div className="p-4 rounded-full bg-slate-50 text-slate-400">
                                    <SearchX className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800">
                                    Foto Tidak Ditemukan
                                </h3>
                                <p className="max-w-md text-xs sm:text-sm text-slate-500">
                                    Belum ada dokumentasi foto untuk kategori "
                                    {kategoriAktif}".
                                </p>
                            </div>
                        )}

                        {/* Pagination Galeri */}
                        {isGaleriPaginated && galeriFoto.links && (
                            <div className="mt-8 flex justify-center">
                                <Pagination links={galeriFoto.links} />
                            </div>
                        )}
                    </section>
                )}

                {/* ================= TAB 2: BERITA & PENGUMUMAN ================= */}
                {tab === "berita" && (
                    <section className="space-y-4 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">
                                Berita &amp; Pengumuman
                            </h2>
                            <span className="text-xs font-semibold text-slate-500">
                                Total {isBeritaPaginated ? berita.total : listBerita.length} Artikel
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            {listBerita.map((item) => {
                                const photoUrl = getImageUrl(item.foto);
                                return (
                                    <Link
                                        key={item.id}
                                        href={route(
                                            "fe.berita.detail",
                                            item.id,
                                        )}
                                        className="group flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 rounded-3xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200"
                                    >
                                        {/* Image Thumbnail */}
                                        <div className="h-44 sm:h-36 sm:w-52 shrink-0 overflow-hidden rounded-2xl bg-slate-100 relative">
                                            {photoUrl ? (
                                                <img
                                                    src={photoUrl}
                                                    alt={item.judul}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-blue-50/50 text-blue-600">
                                                    <FileText className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex flex-col justify-between flex-1 space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2.5 flex-wrap">
                                                    <span
                                                        className={`rounded-full px-3 py-0.5 text-[11px] font-bold border ${
                                                            kategoriBadgeWarna[
                                                                item.kategori
                                                            ] ||
                                                            "bg-blue-50 text-blue-700 border-blue-100"
                                                        }`}
                                                    >
                                                        {item.kategori}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                        {formatDate(
                                                            item.tanggal,
                                                        )}
                                                    </span>
                                                </div>

                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                                                    {item.judul}
                                                </h3>

                                                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                                    {item.ringkasan}
                                                </p>
                                            </div>

                                            <div className="pt-2 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                                                <span>Baca Selengkapnya</span>
                                                <ArrowUpRight className="h-4 w-4 ml-1" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination Berita */}
                        {isBeritaPaginated && berita.links && (
                            <div className="mt-8 flex justify-center">
                                <Pagination links={berita.links} />
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* ================= LIGHTBOX MODAL SLIDER (TAMPILKAN SELURUH FOTO) ================= */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6 sm:p-8">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Modal Image Slider Container */}
                        <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-[50vh] sm:h-[60vh] flex items-center justify-center">
                            {activePhotoList.length > 0 &&
                            getImageUrl(activePhotoList[activePhotoIndex]) ? (
                                <img
                                    src={
                                        getImageUrl(
                                            activePhotoList[activePhotoIndex],
                                        ) as string
                                    }
                                    alt={`${selectedItem.caption} (${activePhotoIndex + 1})`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                                    <Camera className="h-12 w-12 text-slate-500" />
                                    <span className="text-xs font-medium text-slate-400">
                                        Foto preview belum diunggah
                                    </span>
                                </div>
                            )}

                            {/* Chevron Slider Controls (Jika foto > 1) */}
                            {activePhotoList.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-md"
                                        title="Foto Sebelumnya"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-md"
                                        title="Foto Selanjutnya"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>

                                    {/* Counter Floating Badge */}
                                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur text-xs font-bold">
                                        Foto {activePhotoIndex + 1} dari{" "}
                                        {activePhotoList.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Modal Info & Thumbnail Strip */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-3 py-0.5 text-xs font-bold border ${
                                            kategoriBadgeWarna[
                                                selectedItem.kategori
                                            ] || "bg-blue-50 text-blue-700"
                                        }`}
                                    >
                                        {selectedItem.kategori}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        {formatDate(selectedItem.tanggal)}
                                    </span>
                                </div>

                                {activePhotoList.length > 1 && (
                                    <span className="text-xs font-bold text-slate-500">
                                        {activePhotoList.length} Foto Kegiatan
                                    </span>
                                )}
                            </div>

                            <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                {selectedItem.caption}
                            </h3>

                            {/* Thumbnail Selector Strip (Tampilkan Seluruh Foto) */}
                            {activePhotoList.length > 1 && (
                                <div className="flex gap-2.5 py-3 pl-1 overflow-x-auto">
                                    {activePhotoList.map((pUrl, idx) => {
                                        const tUrl = getImageUrl(pUrl);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    setActivePhotoIndex(idx)
                                                }
                                                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                                    activePhotoIndex === idx
                                                        ? "border-blue-800 scale-105 shadow-xs"
                                                        : "border-slate-200 opacity-60 hover:opacity-100"
                                                }`}
                                            >
                                                {tUrl ? (
                                                    <img
                                                        src={tUrl}
                                                        alt={`Thumb ${idx + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                                                        <Camera className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= FOOTER ================= */}
            <Footer />
        </div>
    );
}
