import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    User as UserIcon,
    MapPin,
    ExternalLink,
    Info,
    Edit3,
    Maximize2,
    X,
    Clock,
    Coins,
} from "lucide-react";
import { Jukir } from "@/types/model";

interface ShowProps {
    jukir: Jukir;
}

export default function Show({ jukir }: ShowProps) {
    const [showPhotoModal, setShowPhotoModal] = useState(false);

    // Ambil data relasi tunggal titik lokasi penugasan
    const wilayah = jukir.wilayah_parkir || jukir.wilayahParkir;

    // Ambil target aktif jika ada
    const activeTarget = jukir.targets && jukir.targets.length > 0 ? jukir.targets[0] : null;

    // Helper format tanggal Bahasa Indonesia
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Helper format nomor WhatsApp
    const formatWaNumber = (phone?: string) => {
        if (!phone) return "";
        let clean = phone.replace(/[^0-9]/g, "");
        if (clean.startsWith("0")) {
            clean = "62" + clean.slice(1);
        }
        return clean;
    };

    return (
        <MainLayout>
            <Head title={`Detail Juru Parkir - ${jukir.nama}`} />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("be.data-jukir.index")}
                        className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-brand-blue-600 hover:border-brand-blue-100 transition-all shadow-xs active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-blue-400"
                        title="Kembali ke Daftar Jukir"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                                Detail Juru Parkir
                            </h1>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Informasi lengkap profil, akun sistem, dan wilayah penugasan
                        </p>
                    </div>
                </div>

                {/* Tombol Aksi Kanan */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        href={route("be.data-jukir.edit", jukir.kode_jukir || jukir.id)}
                        className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                    >
                        <span>Edit Data</span>
                    </Button>
                </div>
            </div>

            {/* Konten Utama Grid 3 Kolom */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Kolom Kiri: Profil Jukir & Akun Login (1 Kolom) */}
                <div className="space-y-6 lg:col-span-1">
                    
                    {/* Kartu Profil Utama (Gaya Kartu ID Jukir) */}
                    <Card className="relative overflow-hidden text-center">
                        {/* Background Banner Biru Solid Brand-Blue */}
                        <div className="h-24 bg-brand-blue-600 flex items-center justify-center relative">
                        </div>

                        <div className="px-6 pb-6 pt-0 relative">
                            {/* Foto Juru Parkir Bulat Rata Tengah */}
                            <div className="relative -mt-14 mb-4 inline-block group">
                                <div className="relative">
                                    <img
                                        src={
                                            jukir.foto
                                                ? jukir.foto.startsWith("http") ||
                                                  jukir.foto.startsWith("/") ||
                                                  jukir.foto.startsWith("assets/")
                                                    ? jukir.foto.startsWith("/")
                                                        ? jukir.foto
                                                        : `/${jukir.foto}`
                                                    : `/storage/${jukir.foto}`
                                                : "/assets/images/dump.jpg"
                                        }
                                        alt={jukir.nama}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow bg-slate-100 dark:bg-slate-800 mx-auto"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/assets/images/dump.jpg";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPhotoModal(true)}
                                        className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                                        title="Perbesar Foto"
                                    >
                                        <Maximize2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Nama & Status */}
                            <div className="mb-6 space-y-2">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                    {jukir.nama}
                                </h2>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-100 dark:bg-brand-blue-900/40 dark:text-brand-blue-300 dark:border-brand-blue-800">
                                        {jukir.kode_jukir || `ID: #${jukir.id.toString().padStart(4, "0")}`}
                                    </span>
                                    <Badge
                                        type={jukir.status === "Aktif" ? "success" : "danger"}
                                    >
                                        {jukir.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Info Kontak & Alamat (Rata Tengah, Tanpa Icon) */}
                            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5 text-sm">
                                {/* Nomor HP / WA */}
                                <div>
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                                        Nomor Telepon
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-200 font-semibold">
                                        {jukir.nohp || "-"}
                                    </p>
                                </div>

                                {/* Alamat */}
                                <div>
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                                        Alamat Tempat Tinggal
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                                        {jukir.alamat || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 2. Kartu Akun Login Sistem */}
                    <Card>
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                                        Akun Login Aplikasi
                                    </h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Akun yang digunakan untuk login ke aplikasi
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 text-xs sm:text-sm">
                            {jukir.user ? (
                                <div className="space-y-3">
                                    {/* Username */}
                                    <div className="grid grid-cols-[95px_12px_1fr] items-baseline">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Username</span>
                                        <span className="text-slate-400 text-center">:</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-100 ">
                                            {jukir.user.username || "-"}
                                        </span>
                                    </div>

                                    {/* Email Akun */}
                                    <div className="grid grid-cols-[95px_12px_1fr] items-baseline">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Email Akun</span>
                                        <span className="text-slate-400 text-center">:</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-100 break-all">
                                            {jukir.user.email}
                                        </span>
                                    </div>

                                    {/* Hak Akses */}
                                    <div className="grid grid-cols-[95px_12px_1fr] items-baseline">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Hak Akses</span>
                                        <span className="text-slate-400 text-center">:</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                                            Juru Parkir
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-slate-400 text-xs">
                                    <Info size={20} className="mx-auto mb-1 text-slate-300" />
                                    Belum ada akun pengguna yang terhubung.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Kolom Kanan: 2 Kolom (Titik Lokasi, Target & Riwayat Transaksi) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. Kartu Titik Wilayah Penugasan (Dipindahkan ke Grid Kanan) */}
                    <Card>
                        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                                        Titik Lokasi Penugasan
                                    </h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Lokasi tugas operasional parkir jukir di lapangan
                                    </p>
                                </div>
                            </div>
                            {wilayah && (
                                <Badge
                                    type={jukir.status === "Aktif" ? "success" : "danger"}
                                >
                                    {jukir.status}
                                </Badge>
                            )}
                        </div>

                        <div className="p-6">
                            {!wilayah ? (
                                <div className="py-6 px-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50/40 dark:bg-slate-800/30">
                                    <MapPin size={22} className="mx-auto mb-1.5 text-slate-400" />
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                                        Belum Ada Titik Penugasan
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                                        Petugas ini belum ditentukan lokasi operasionalnya.
                                    </p>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        href={route("be.data-jukir.edit", jukir.kode_jukir || jukir.id)}
                                    >
                                        <Edit3 size={13} />
                                        <span>Tentukan Lokasi</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Nama Titik / Jalan */}
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700">
                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                                            Nama Jalan / Titik Lokasi
                                        </span>
                                        <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                                            {wilayah.nama_jalan}
                                        </p>
                                    </div>

                                    {/* Wilayah / Kecamatan */}
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700">
                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                                            Kecamatan / Wilayah
                                        </span>
                                        <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                                            {wilayah.kecamatan?.nama_kecamatan || "Kab. Tasikmalaya"}
                                        </p>
                                    </div>

                                    {/* Koordinat GPS & Peta */}
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                                                Koordinat GPS
                                            </span>
                                            <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                {wilayah.latitude && wilayah.longitude
                                                    ? `${wilayah.latitude}, ${wilayah.longitude}`
                                                    : "Belum diset"}
                                            </p>
                                        </div>
                                        {wilayah.latitude && wilayah.longitude && (
                                            <a
                                                href={`https://www.google.com/maps?q=${wilayah.latitude},${wilayah.longitude}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue-600 hover:text-brand-blue-700 dark:text-brand-blue-400 mt-2"
                                            >
                                                <span>Buka di Google Maps</span>
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 2. Target Retribusi Parkir Card */}
                    <Card>
                        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-brand-green-50 text-brand-green-600 dark:bg-brand-green-950/60 dark:text-brand-green-400">
                                    <Coins size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                                        Target Retribusi Parkir
                                    </h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Ketetapan target setoran PAD jukir {activeTarget ? `Tahun ${activeTarget.tahun}` : ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {activeTarget ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-2xl bg-brand-green-50/50 border border-brand-green-100 dark:bg-slate-800 dark:border-brand-green-900/40">
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                                            Target per Hari
                                        </span>
                                        <p className="text-xl font-bold text-brand-green-700 dark:text-brand-green-400">
                                            Rp {Number(activeTarget.target_per_hari).toLocaleString("id-ID")}
                                        </p>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                                            Per hari kerja
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700">
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                                            Hari Kerja Aktif
                                        </span>
                                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                            {activeTarget.jml_hari} Hari
                                        </p>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                                            Per bulan
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-brand-blue-50/50 border border-brand-blue-100 dark:bg-slate-800 dark:border-brand-blue-900/40">
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                                            Estimasi Target Bulanan
                                        </span>
                                        <p className="text-xl font-bold text-brand-blue-600 dark:text-brand-blue-400">
                                            Rp {Number(activeTarget.total_target).toLocaleString("id-ID")}
                                        </p>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                                            Berlaku 12 bulan ({activeTarget.tahun})
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 px-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50/40 dark:bg-slate-800/30">
                                    <Coins size={22} className="mx-auto mb-1.5 text-slate-400" />
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                                        Belum Ada Target Retribusi
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                                        Petugas ini belum ditentukan besaran target setoran hariannya.
                                    </p>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        href={route("be.data-jukir.edit", jukir.kode_jukir || jukir.id)}
                                    >
                                        <Edit3 size={13} />
                                        <span>Tentukan Target</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 3. Kartu Buku Catatan & Riwayat Transaksi Setoran */}
                    <Card>
                        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                                        Buku Catatan & Riwayat Setoran
                                    </h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Rekapitulasi pembukuan setoran tunai & transaksi QRIS Bank BJB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="p-6 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-blue-50/30 dark:from-slate-800/50 dark:to-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-1.5 text-center sm:text-left">
                                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                        Buku Catatan Finansial Juru Parkir
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                                        Seluruh rekam jejak pembayaran retribusi, perhitungan sisa tunggakan, cetak kuitansi, dan mutasi kas tunai/QRIS dikelola secara terpusat pada modul Setoran Harian.
                                    </p>
                                </div>

                                <Link
                                    href={route("be.setoran-harian.detail-setoran", jukir.kode_jukir || jukir.id)}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-brand-blue-600 hover:bg-brand-blue-700 text-white shadow-md shadow-brand-blue-200 dark:shadow-none transition-all active:scale-95 shrink-0"
                                >
                                    <span>Buka Buku Catatan & Transaksi Lengkap</span>
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modal Perbesar Foto Jukir */}
            {showPhotoModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setShowPhotoModal(false)}
                >
                    <div
                        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-4 overflow-hidden relative shadow-2xl border border-slate-200 dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                Foto Resmi Juru Parkir: {jukir.nama}
                            </h4>
                            <button
                                type="button"
                                onClick={() => setShowPhotoModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <img
                            src={
                                jukir.foto
                                    ? jukir.foto.startsWith("http") ||
                                      jukir.foto.startsWith("/") ||
                                      jukir.foto.startsWith("assets/")
                                        ? jukir.foto.startsWith("/")
                                            ? jukir.foto
                                            : `/${jukir.foto}`
                                        : `/storage/${jukir.foto}`
                                    : "/assets/images/dump.jpg"
                            }
                            alt={jukir.nama}
                            className="w-full max-h-[70vh] object-contain rounded-2xl bg-slate-50 dark:bg-slate-950"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/images/dump.jpg";
                            }}
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
