import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import StatCard from "@/Components/UI/SatistikCard";
import TextInput from "@/Components/Form/TextInput";
import TextArea from "@/Components/Form/TextArea";
import SelectSearch from "@/Components/Form/SelectSearch";
import Modal from "@/Components/UI/Modal";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import SimulasiNotice from "@/Components/UI/SimulasiNotice";
import Pagination from "@/Components/Data/Pagination";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Search,
    RotateCcw,
    Printer,
    MapPin,
    Calendar,
    Clock,
    Plus,
    Banknote,
    Trash2,
    Coins,
    TrendingUp,
    Wallet,
    Phone,
    ShieldCheck,
    FileText,
    CalendarDays,
    AlertTriangle,
    AlertCircle,
    CheckCircle2,
    Check,
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

export interface DailyAuditItem {
    tanggal: string;
    hari: string;
    formatted_tanggal: string;
    short_tanggal: string;
    is_today: boolean;
    target: number;
    setor: number;
    kurang: number;
    status: "Lunas" | "Kurang" | "Nunggak" | string;
    trx_count: number;
}

export interface TransaksiSetoran {
    id: number;
    jukir_id: number;
    petugas_id?: number | null;
    kode_transaksi: string;
    tanggal: string;
    jam?: string | null;
    nominal_setor: number | string;
    metode_pembayaran: "Tunai" | "QRIS" | string;
    status: "Pending" | "Success" | "Failed" | string;
    bukti_setor?: string | null;
    keterangan?: string | null;
    petugas?: {
        id: number;
        name: string;
    } | null;
    created_at?: string;
}

export interface JukirDetail {
    id: number;
    kode_jukir: string;
    nama: string;
    nohp?: string;
    foto?: string;
    status: string;
    titik_parkir: string;
    kecamatan: string;
    target_harian: number;
    target_bulanan: number;
}

export interface DetailStats {
    setorHariIni: number;
    targetHarian: number;
    sisaHariIni: number;
    setorBulanIni: number;
    targetBulanan: number;
    sisaBulanIni: number;
    totalTunggakanBulanIni?: number;
    hariLunasCount?: number;
    hariKurangCount?: number;
    hariNunggakCount?: number;
    totalHariBerjalan?: number;
    totalSemuaSetor: number;
    totalTunai: number;
    totalQRIS: number;
    namaBulan?: string;
}

interface DetailSetoranProps {
    jukir: JukirDetail;
    stats: DetailStats;
    dailyAudit?: DailyAuditItem[];
    riwayat: PaginatedData<TransaksiSetoran>;
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
        metode_pembayaran?: string;
        per_page?: string | number;
    };
}

export default function DetailSetoran({
    jukir,
    stats: serverStats,
    dailyAudit: serverDailyAudit = [],
    riwayat: serverRiwayat,
    filters = {},
}: DetailSetoranProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const canCreateSetoran =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("create-setoran-harian");

    // Local state data
    const [localRiwayat, setLocalRiwayat] = useState<PaginatedData<TransaksiSetoran>>(serverRiwayat);
    const [stats, setStats] = useState<DetailStats>(serverStats);
    const [dailyAudit, setDailyAudit] = useState<DailyAuditItem[]>(serverDailyAudit);

    // Tab state & Audit filter state
    const [activeTab, setActiveTab] = useState<"audit" | "riwayat">("audit");
    const [auditFilter, setAuditFilter] = useState<"semua" | "nunggak" | "lunas">("semua");

    // Filter states for transaction history
    const [search, setSearch] = useState(filters.search || "");
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    const [selectedMetode, setSelectedMetode] = useState(filters.metode_pembayaran || "");
    const [isLoading, setIsLoading] = useState(false);

    // Modal Catat Setoran Tunai
    const [showSetorModal, setShowSetorModal] = useState(false);

    // Modal Konfirmasi Batal Setoran
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<TransaksiSetoran | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form Hook untuk Input Setoran Tunai Manual
    const {
        data: formData,
        setData: setFormData,
        post,
        processing,
        errors,
        reset: resetForm,
        clearErrors,
    } = useForm({
        jukir_id: jukir.id,
        tanggal: new Date().toISOString().split("T")[0],
        jam: new Date().toTimeString().slice(0, 5),
        nominal_setor: String(jukir.target_harian || ""),
        metode_pembayaran: "Tunai",
        keterangan: "Setoran tunai harian",
    });

    useEffect(() => {
        setLocalRiwayat(serverRiwayat);
    }, [serverRiwayat]);

    useEffect(() => {
        setStats(serverStats);
    }, [serverStats]);

    useEffect(() => {
        setDailyAudit(serverDailyAudit);
    }, [serverDailyAudit]);

    // Opsi Metode Pembayaran
    const metodeOptions = [
        { value: "", label: "Semua Metode" },
        { value: "Tunai", label: "Metode: Tunai" },
        { value: "QRIS", label: "Metode: QRIS Bank BJB" },
    ];

    // Format Rupiah
    const formatRupiah = (val?: number | string) => {
        const num = Number(val) || 0;
        return `Rp ${num.toLocaleString("id-ID")}`;
    };

    // Fetching Data AJAX dengan Debounce
    const isFirstRender = useRef(true);

    const fetchData = (overrideParams: Record<string, any> = {}) => {
        setIsLoading(true);
        const params = {
            search,
            start_date: startDate,
            end_date: endDate,
            metode_pembayaran: selectedMetode,
            page: 1,
            ...overrideParams,
        };

        axios
            .get(route("be.setoran-harian.detail-setoran", jukir.kode_jukir || jukir.id), {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data) {
                    if (res.data.riwayat) setLocalRiwayat(res.data.riwayat);
                    if (res.data.stats) setStats(res.data.stats);
                    if (res.data.dailyAudit) setDailyAudit(res.data.dailyAudit);
                }
            })
            .catch((err) => console.error("Error fetching detail setoran:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, startDate, endDate, selectedMetode]);

    const handleResetFilter = () => {
        setSearch("");
        setStartDate("");
        setEndDate("");
        setSelectedMetode("");
    };

    // Buka Modal Catat Setoran Hari Ini
    const handleOpenSetorModal = () => {
        clearErrors();
        resetForm();
        const todayStr = new Date().toISOString().split("T")[0];
        const timeStr = new Date().toTimeString().slice(0, 5);
        const sisa = stats.sisaHariIni > 0 ? stats.sisaHariIni : jukir.target_harian;

        setFormData({
            jukir_id: jukir.id,
            tanggal: todayStr,
            jam: timeStr,
            nominal_setor: String(sisa || ""),
            metode_pembayaran: "Tunai",
            keterangan: "Setoran tunai harian",
        });

        setShowSetorModal(true);
    };

    // Buka Modal Pelunasan untuk Tanggal Tertentu (Nunggak/Kurang)
    const handlePaySpecificDate = (item: DailyAuditItem) => {
        clearErrors();
        resetForm();
        const timeStr = new Date().toTimeString().slice(0, 5);

        setFormData({
            jukir_id: jukir.id,
            tanggal: item.tanggal,
            jam: timeStr,
            nominal_setor: String(item.kurang > 0 ? item.kurang : jukir.target_harian),
            metode_pembayaran: "Tunai",
            keterangan: `Pelunasan setoran ${item.hari}, ${item.short_tanggal}`,
        });

        setShowSetorModal(true);
    };

    // Submit Catat Setoran Tunai
    const handleSubmitSetoran = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.setoran-harian.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSetorModal(false);
                resetForm();
                fetchData();
            },
        });
    };

    // Batalkan Transaksi Setoran Tunai
    const openDeleteConfirmation = (item: TransaksiSetoran) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDeleteSetoran = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        router.delete(route("be.setoran-harian.destroy", itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setTimeout(() => setItemToDelete(null), 300);
                fetchData();
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    // Hitung persentase capaian
    const persentaseHariIni =
        stats.targetHarian > 0
            ? Math.round((stats.setorHariIni / stats.targetHarian) * 100)
            : 0;
    const persentaseBulanIni =
        stats.targetBulanan > 0
            ? Math.round((stats.setorBulanIni / stats.targetBulanan) * 100)
            : 0;

    const totalBermasalah =
        (stats.hariKurangCount || 0) + (stats.hariNunggakCount || 0);

    // Filter data audit harian
    const filteredDailyAudit = dailyAudit.filter((item) => {
        if (auditFilter === "nunggak") {
            return item.status === "Kurang" || item.status === "Nunggak";
        }
        if (auditFilter === "lunas") {
            return item.status === "Lunas";
        }
        return true;
    });

    return (
        <MainLayout>
            <Head title={`Buku Catatan Setoran - ${jukir.nama}`} />

            {/* Floating Toastr Fixed di Sudut Kiri Atas (Status Fitur Simulasi) */}
            <SimulasiNotice />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("be.setoran-harian.index")}
                        className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-brand-blue-600 hover:border-brand-blue-100 transition-all shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-blue-400 active:scale-95"
                        title="Kembali ke Daftar Setoran Harian"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                            Buku Catatan Pembayaran Jukir
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Audit rincian pemenuhan target per tanggal & riwayat transaksi setoran
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {canCreateSetoran && (
                        <Button
                            variant="primary"
                            onClick={handleOpenSetorModal}
                            className="flex items-center gap-2 shadow-sm"
                        >
                            <Plus size={16} />
                            <span>Catat Setoran Tunai</span>
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        onClick={() => window.print()}
                        className="flex items-center gap-2 shadow-sm"
                    >
                        <Printer size={16} />
                        <span>Cetak Riwayat</span>
                    </Button>
                </div>
            </div>

            {/* Profil Ringkas Juru Parkir */}
            <Card className="p-5 md:p-6 mb-8 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <img
                            src={
                                jukir.foto &&
                                jukir.foto !== "" &&
                                !jukir.foto.includes("default")
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
                            className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/images/dump.jpg";
                            }}
                        />

                        <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge type="info" className="">
                                    {jukir.kode_jukir}
                                </Badge>
                                <Badge
                                    type={jukir.status === "Aktif" ? "success" : "danger"}
                                >
                                    {jukir.status}
                                </Badge>
                                <Badge type="default">Kec. {jukir.kecamatan}</Badge>
                            </div>

                            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                                {jukir.nama}
                            </h2>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-brand-blue-500 shrink-0" />
                                    <strong className="text-slate-700 dark:text-slate-300">
                                        {jukir.titik_parkir}
                                    </strong>
                                </span>

                                {jukir.nohp && (
                                    <span className="flex items-center gap-1.5">
                                        <Phone size={13} className="text-slate-400 shrink-0" />
                                        <span>{jukir.nohp}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Box Target Resmi */}
                    <div className="flex items-center gap-3 sm:gap-6 bg-slate-50 dark:bg-slate-700 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shrink-0">
                        <div className="text-left sm:text-right">
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                                Target Retribusi Harian
                            </span>
                            <span className="text-lg md:text-xl font-bold text-brand-blue-600 dark:text-brand-blue-400">
                                {formatRupiah(jukir.target_harian)}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                                Bulanan: {formatRupiah(jukir.target_bulanan)}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Banner Peringatan Tunggakan jika ada tanggal yang Kurang / Nunggak */}
            {totalBermasalah > 0 && (
                <div className="mb-8 p-4 sm:p-5 bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-xs shrink-0 mt-0.5 sm:mt-0">
                                <AlertTriangle size={22} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-sm sm:text-base font-bold text-rose-800 dark:text-rose-200">
                                        Perhatian: Terdapat {totalBermasalah} Tanggal Belum Memenuhi Target
                                    </h3>
                                    <Badge type="danger">
                                        {formatRupiah(stats.totalTunggakanBulanIni ?? stats.sisaBulanIni)}
                                    </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                                    Pada bulan <strong>{stats.namaBulan || "berjalan"}</strong> (tanggal 1 s.d. hari ini), jukir tercatat memiliki{" "}
                                    <strong>{stats.hariNunggakCount || 0} hari nunggak</strong> dan{" "}
                                    <strong>{stats.hariKurangCount || 0} hari kurang setor</strong>. Periksa rincian tanggal di bawah untuk melunasi setoran terkait.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4 Kartu Statistik Finansial Jukir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Setoran Hari Ini"
                    value={formatRupiah(stats.setorHariIni)}
                    icon={Coins}
                    color="bg-brand-blue-500"
                    period="Hari Ini"
                    description={`${persentaseHariIni}% dari target (${formatRupiah(stats.targetHarian)})`}
                />

                <StatCard
                    title="Sisa Tunggakan Hari Ini"
                    value={formatRupiah(stats.sisaHariIni)}
                    icon={Wallet}
                    color={stats.sisaHariIni > 0 ? "bg-rose-500" : "bg-emerald-500"}
                    period="Hari Ini"
                    description={
                        stats.sisaHariIni > 0
                            ? "Kekurangan retribusi hari ini"
                            : "Target hari ini terpenuhi / lunas"
                    }
                />

                <StatCard
                    title="Setoran Bulan Ini"
                    value={formatRupiah(stats.setorBulanIni)}
                    icon={TrendingUp}
                    color="bg-brand-green-500"
                    period="Bulan Ini"
                    description={`${persentaseBulanIni}% dari target bulanan`}
                />

                <StatCard
                    title={`Tunggakan ${stats.namaBulan ? `(${stats.namaBulan})` : "Bulan Ini"}`}
                    value={formatRupiah(stats.totalTunggakanBulanIni ?? stats.sisaBulanIni)}
                    icon={AlertCircle}
                    color={totalBermasalah > 0 ? "bg-rose-500" : "bg-emerald-500"}
                    period="1 s.d. Hari Ini"
                    description={
                        totalBermasalah > 0
                            ? `${totalBermasalah} hari belum terpenuhi (${stats.hariNunggakCount || 0} nunggak, ${stats.hariKurangCount || 0} kurang)`
                            : "Seluruh hari berjalan lunas tepat target"
                    }
                />
            </div>

            {/* Card Utama: Navigasi Tab Audit Harian & Log Transaksi */}
            <Card className="!overflow-visible relative z-30 dark:bg-slate-800 dark:border-slate-700">
                {/* Header Card: Tab Switcher */}
                <div className="p-4 md:p-5 bg-white dark:bg-slate-800 rounded-t-3xl border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-2xl w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab("audit")}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === "audit"
                                    ? "bg-white dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400 shadow-xs"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            <CalendarDays size={16} />
                            <span>Audit Harian & Tanggal</span>
                            {totalBermasalah > 0 ? (
                                <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300 rounded-full">
                                    {totalBermasalah} 
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full">
                                    Lunas
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("riwayat")}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === "riwayat"
                                    ? "bg-white dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400 shadow-xs"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            <FileText size={16} />
                            <span>Log Kuitansi Transaksi</span>
                            <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full">
                                {localRiwayat.total}
                            </span>
                        </button>
                    </div>

                    {activeTab === "audit" && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>Periode Audit:</span>
                            <strong className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-xl">
                                1 s.d. {stats.totalHariBerjalan || dailyAudit.length} {stats.namaBulan || ""}
                            </strong>
                        </div>
                    )}
                </div>

                {/* TAB 1: AUDIT TANGGAL & PEMBUKUAN HARIAN */}
                {activeTab === "audit" && (
                    <div>
                        {/* Sub-filter Status Hari */}
                        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                                    Filter Baris:
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setAuditFilter("semua")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        auditFilter === "semua"
                                            ? "bg-brand-blue-600 text-white shadow-xs"
                                            : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    Semua Tanggal ({dailyAudit.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuditFilter("nunggak")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        auditFilter === "nunggak"
                                            ? "bg-rose-600 text-white shadow-xs"
                                            : "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50/50"
                                    }`}
                                >
                                    <span>Nunggak / Kurang ({totalBermasalah})</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuditFilter("lunas")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                        auditFilter === "lunas"
                                            ? "bg-emerald-600 text-white shadow-xs"
                                            : "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50/50"
                                    }`}
                                >
                                    <span>Lunas ({stats.hariLunasCount ?? 0})</span>
                                </button>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Menampilkan <strong className="text-slate-700 dark:text-slate-200">{filteredDailyAudit.length}</strong> tanggal pembukuan
                            </div>
                        </div>

                        {/* Tabel Audit Harian */}
                        <Table
                            columns={[
                                {
                                    header: "#",
                                    className: "text-center text-xs font-medium text-slate-400 dark:text-slate-300 w-12",
                                    headerClassName: "text-center w-12",
                                    render: (_: DailyAuditItem, index: number) => index + 1,
                                },
                                {
                                    header: "TANGGAL",
                                    className: "w-56 text-xs",
                                    render: (item: DailyAuditItem) => (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                    {item.formatted_tanggal}
                                                </span>
                                                {item.is_today && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-brand-blue-100 text-brand-blue-700 dark:bg-brand-blue-900/50 dark:text-brand-blue-300 rounded-md">
                                                        Hari Ini
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                                                {item.trx_count > 0
                                                    ? `${item.trx_count} transaksi setor tercatat`
                                                    : "Belum ada pembayaran setoran"}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    header: "TARGET RESMI",
                                    className: "w-36 text-xs text-right font-medium text-slate-600 dark:text-slate-400",
                                    headerClassName: "text-right w-36",
                                    render: (item: DailyAuditItem) => formatRupiah(item.target),
                                },
                                {
                                    header: "REALISASI SETOR",
                                    className: "w-40 text-xs text-right font-bold text-emerald-600 dark:text-emerald-400",
                                    headerClassName: "text-right w-40",
                                    render: (item: DailyAuditItem) => formatRupiah(item.setor),
                                },
                                {
                                    header: "KEKURANGAN / SISA",
                                    className: "w-44 text-xs text-right font-bold",
                                    headerClassName: "text-right w-44",
                                    render: (item: DailyAuditItem) => (
                                        <span
                                            className={
                                                item.kurang > 0
                                                    ? "text-rose-600 dark:text-rose-400 font-extrabold"
                                                    : "text-slate-400 dark:text-slate-500 font-normal"
                                            }
                                        >
                                            {item.kurang > 0 ? formatRupiah(item.kurang) : "Rp 0 (Lunas)"}
                                        </span>
                                    ),
                                },
                                {
                                    header: "STATUS PEMENUHAN",
                                    className: "w-36 text-center",
                                    headerClassName: "text-center w-36",
                                    render: (item: DailyAuditItem) => {
                                        let badgeType: "success" | "warning" | "danger" = "success";
                                        let label = "Lunas";

                                        if (item.status === "Nunggak") {
                                            badgeType = "danger";
                                            label = "Nunggak";
                                        } else if (item.status === "Kurang") {
                                            badgeType = "warning";
                                            label = `Kurang (${formatRupiah(item.kurang)})`;
                                        }

                                        return (
                                            <Badge type={badgeType} className="font-bold">
                                                {label}
                                            </Badge>
                                        );
                                    },
                                },
                                {
                                    header: "AKSI LUNASI",
                                    className: "w-32 text-center",
                                    headerClassName: "text-center w-32",
                                    render: (item: DailyAuditItem) => (
                                        <div className="flex items-center justify-center">
                                            {item.kurang > 0 && canCreateSetoran ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handlePaySpecificDate(item)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green-500 hover:bg-brand-green-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
                                                    title={`Catat pelunasan setoran untuk tanggal ${item.short_tanggal}`}
                                                >
                                                    <Banknote size={14} />
                                                    <span>Lunasi</span>
                                                </button>
                                            ) : item.kurang === 0 ? (
                                                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                                    <Check size={14} className="stroke-[3]" />
                                                    <span>Terpenuhi</span>
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </div>
                                    ),
                                },
                            ]}
                            data={filteredDailyAudit}
                            keyExtractor={(item) => item.tanggal}
                            emptyMessage="Tidak ada tanggal yang cocok dengan filter pembukuan."
                        />

                        {/* Footer Informasi Audit */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-b-3xl border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                                Rekap pembukuan harian dari tanggal{" "}
                                <strong className="text-slate-800 dark:text-slate-200">
                                    1 {stats.namaBulan || ""}
                                </strong>{" "}
                                sampai{" "}
                                <strong className="text-slate-800 dark:text-slate-200">
                                    {stats.totalHariBerjalan || dailyAudit.length} {stats.namaBulan || ""}
                                </strong>
                            </span>

                            <div className="flex items-center gap-4">
                                <span>
                                    Total Tunggakan:{" "}
                                    <strong className="text-rose-600 dark:text-rose-400 font-bold text-sm">
                                        {formatRupiah(stats.totalTunggakanBulanIni ?? stats.sisaBulanIni)}
                                    </strong>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: LOG KUITANSI TRANSAKSI MASUK */}
                {activeTab === "riwayat" && (
                    <div>
                        {/* Header Filter Toolbar Transaksi */}
                        <div className="p-4 md:p-5 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 relative z-30">
                            <div className="flex-1 min-w-[200px]">
                                <TextInput
                                    iconLeft={<Search size={18} />}
                                    className="w-full text-sm font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                    placeholder="Cari kode transaksi atau keterangan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Filter Rentang Tanggal */}
                            <div className="flex items-center gap-2">
                                <div className="w-32 sm:w-36">
                                    <TextInput
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="text-xs py-2 font-medium cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        placeholder="Dari Tanggal"
                                    />
                                </div>
                                <span className="text-slate-400 text-xs font-bold">—</span>
                                <div className="w-32 sm:w-36">
                                    <TextInput
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="text-xs py-2 font-medium cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        placeholder="Sampai Tanggal"
                                    />
                                </div>
                            </div>

                            {/* Filter Metode Pembayaran */}
                            <div className="w-full sm:w-44">
                                <SelectSearch
                                    options={metodeOptions}
                                    value={selectedMetode}
                                    onChange={(val) => setSelectedMetode(String(val))}
                                    placeholder="Semua Metode..."
                                />
                            </div>

                            {(search || startDate || endDate || selectedMetode) && (
                                <Button
                                    variant="danger"
                                    onClick={handleResetFilter}
                                    className="flex items-center gap-1.5 text-xs py-2 px-3 shadow-xs"
                                >
                                    <RotateCcw size={14} />
                                    <span>Reset</span>
                                </Button>
                            )}
                        </div>

                        {/* Tabel Data Riwayat Transaksi */}
                        <Table
                            columns={[
                                {
                                    header: "#",
                                    className: "text-center text-xs font-medium text-slate-400 dark:text-slate-300 w-12",
                                    headerClassName: "text-center w-12",
                                    render: (_: TransaksiSetoran, index: number) =>
                                        (localRiwayat.current_page - 1) * localRiwayat.per_page + index + 1,
                                },
                                {
                                    header: "WAKTU TRANSAKSI",
                                    className: "w-52 text-xs",
                                    render: (item: TransaksiSetoran) => (
                                        <div>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                                {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Clock size={11} />
                                                <span>{item.jam ? item.jam.slice(0, 5) : "-"} WIB</span>
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    header: "KODE TRANSAKSI",
                                    className: "w-48 text-xs font-medium text-slate-700 dark:text-slate-300",
                                    render: (item: TransaksiSetoran) => item.kode_transaksi,
                                },
                                {
                                    header: "METODE PEMBAYARAN",
                                    className: "w-36 text-xs text-center",
                                    headerClassName: "text-center w-36",
                                    render: (item: TransaksiSetoran) => (
                                        <Badge
                                            type={item.metode_pembayaran === "QRIS" ? "info" : "success"}
                                            className="font-semibold"
                                        >
                                            {item.metode_pembayaran === "QRIS"
                                                ? "QRIS Bank BJB"
                                                : "Tunai Fisik"}
                                        </Badge>
                                    ),
                                },
                                {
                                    header: "NOMINAL SETOR",
                                    className: "w-40 text-xs text-right font-bold text-emerald-600 dark:text-emerald-400",
                                    headerClassName: "text-right w-40",
                                    render: (item: TransaksiSetoran) => formatRupiah(item.nominal_setor),
                                },
                                {
                                    header: "PETUGAS / SUMBER",
                                    className: "w-44 text-xs text-slate-600 dark:text-slate-400",
                                    render: (item: TransaksiSetoran) =>
                                        item.petugas ? item.petugas.name : "Gateway QRIS BJB",
                                },
                                {
                                    header: "KETERANGAN",
                                    className: "text-xs text-slate-500 dark:text-slate-400",
                                    render: (item: TransaksiSetoran) => item.keterangan || "—",
                                },
                                {
                                    header: "STATUS",
                                    className: "w-28 text-center",
                                    headerClassName: "text-center w-28",
                                    render: (item: TransaksiSetoran) => (
                                        <Badge
                                            type={
                                                item.status === "Success"
                                                    ? "success"
                                                    : item.status === "Pending"
                                                    ? "warning"
                                                    : "danger"
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    ),
                                },
                                {
                                    header: "AKSI",
                                    className: "w-20 text-center",
                                    headerClassName: "text-center w-20",
                                    render: (item: TransaksiSetoran) => (
                                        <div className="flex items-center justify-center">
                                            {item.metode_pembayaran === "Tunai" ? (
                                                <button
                                                    onClick={() => openDeleteConfirmation(item)}
                                                    title="Batalkan Transaksi Tunai"
                                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            ) : (
                                                <span
                                                    title="Transaksi QRIS tidak dapat dibatalkan manual"
                                                    className="p-1.5 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                                >
                                                    <ShieldCheck size={15} />
                                                </span>
                                            )}
                                        </div>
                                    ),
                                },
                            ]}
                            data={localRiwayat.data}
                            keyExtractor={(item) => item.id}
                            emptyMessage="Belum ada riwayat transaksi setoran yang cocok dengan filter."
                        />

                        {/* Footer Informasi & Paginasi */}
                        <div className="p-5 bg-white dark:bg-slate-800 rounded-b-3xl border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                                Menampilkan{" "}
                                <strong className="text-slate-800 dark:text-slate-200">
                                    {localRiwayat.data.length}
                                </strong>{" "}
                                dari{" "}
                                <strong className="text-slate-800 dark:text-slate-200">
                                    {localRiwayat.total}
                                </strong>{" "}
                                transaksi
                            </span>

                            <Pagination
                                links={localRiwayat.links}
                                onPageChange={(url) => {
                                    router.get(url, {}, { preserveState: true, preserveScroll: true });
                                }}
                            />
                        </div>
                    </div>
                )}
            </Card>

            {/* Modal Form Catat Setoran Tunai Manual */}
            <Modal
                show={showSetorModal}
                onClose={() => setShowSetorModal(false)}
                title={
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-xl">
                            <Banknote size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Catat Setoran Tunai - {jukir.nama}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                {jukir.titik_parkir} • Kecamatan {jukir.kecamatan}
                            </p>
                        </div>
                    </div>
                }
                maxWidth="lg"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setShowSetorModal(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmitSetoran}
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan Setoran"}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmitSetoran} className="space-y-4 p-1">
                    {/* Ringkasan Target */}
                    <div className="p-3 bg-brand-blue-50/70 dark:bg-slate-700/50 rounded-xl border border-brand-blue-100 dark:border-slate-600 flex items-center justify-between text-xs">
                        <div>
                            <span className="text-slate-500 dark:text-slate-400 block">
                                Target Retribusi Harian:
                            </span>
                            <strong className="text-brand-blue-600 dark:text-brand-blue-400 font-bold text-sm">
                                {formatRupiah(jukir.target_harian)}
                            </strong>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 dark:text-slate-400 block">
                                Tanggal Setoran Terpilih:
                            </span>
                            <strong className="text-brand-blue-600 dark:text-brand-blue-400 font-bold text-sm">
                                {formData.tanggal}
                            </strong>
                        </div>
                    </div>

                    {/* Tanggal & Jam */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                Tanggal Setoran <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                type="date"
                                value={formData.tanggal}
                                onChange={(e) => setFormData("tanggal", e.target.value)}
                                className="w-full text-sm cursor-pointer"
                                error={errors.tanggal}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                Jam Setor
                            </label>
                            <TextInput
                                type="time"
                                value={formData.jam}
                                onChange={(e) => setFormData("jam", e.target.value)}
                                className="w-full text-sm cursor-pointer"
                                error={errors.jam}
                            />
                        </div>
                    </div>

                    {/* Nominal Setoran */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Nominal Setoran (Rp) <span className="text-rose-500">*</span>
                            </label>
                            {jukir.target_harian > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(
                                            "nominal_setor",
                                            String(jukir.target_harian)
                                        )
                                    }
                                    className="text-[11px] font-semibold text-brand-blue-600 dark:text-brand-blue-400 hover:underline cursor-pointer"
                                >
                                    Isi Sesuai Target Harian ({formatRupiah(jukir.target_harian)})
                                </button>
                            )}
                        </div>
                        <TextInput
                            type="number"
                            placeholder="Contoh: 20000"
                            value={formData.nominal_setor}
                            onChange={(e) => setFormData("nominal_setor", e.target.value)}
                            className="w-full text-sm font-bold text-slate-800 dark:text-slate-100"
                            error={errors.nominal_setor}
                        />
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                            Keterangan / Catatan
                        </label>
                        <TextArea
                            rows={2}
                            placeholder="Contoh: Setoran tunai shift pagi / pelunasan tunggakan"
                            value={formData.keterangan}
                            onChange={(e) => setFormData("keterangan", e.target.value)}
                            className="w-full text-sm"
                            error={errors.keterangan}
                        />
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Batal Setoran */}
            <ConfirmationModal
                show={showDeleteModal}
                title="Batalkan Transaksi Setoran"
                message={
                    itemToDelete ? (
                        <span>
                            Apakah Anda yakin ingin membatalkan transaksi setoran tunai dengan kode{" "}
                            <strong>[{itemToDelete.kode_transaksi}]</strong> sebesar{" "}
                            <strong>{formatRupiah(itemToDelete.nominal_setor)}</strong>? Saldo setoran jukir
                            akan disesuaikan kembali.
                        </span>
                    ) : (
                        "Apakah Anda yakin ingin membatalkan transaksi ini?"
                    )
                }
                onConfirm={handleDeleteSetoran}
                onCancel={() => setShowDeleteModal(false)}
                processing={isDeleting}
                confirmText="Ya, Batalkan Setoran"
                confirmVariant="danger"
            />
        </MainLayout>
    );
}