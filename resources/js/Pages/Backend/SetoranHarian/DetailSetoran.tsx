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
    CreditCard,
    Phone,
    ShieldCheck,
    FileSpreadsheet,
    FileText,
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

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
    totalSemuaSetor: number;
    totalTunai: number;
    totalQRIS: number;
}

interface DetailSetoranProps {
    jukir: JukirDetail;
    stats: DetailStats;
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

    // Filter states
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

    // Buka Modal Catat Setoran
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
                setItemToDelete(null);
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

    return (
        <MainLayout>
            <Head title={`Buku Catatan Setoran - ${jukir.nama}`} />

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
                            Rekapitulasi riwayat transaksi setoran tunai & QRIS juru parkir
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
                    title="Komposisi QRIS vs Tunai"
                    value={formatRupiah(stats.totalSemuaSetor)}
                    icon={CreditCard}
                    color="bg-amber-500"
                    period="Total Tercatat"
                    description={`QRIS: ${formatRupiah(stats.totalQRIS)} | Tunai: ${formatRupiah(stats.totalTunai)}`}
                />
            </div>

            {/* Card Tabel Riwayat Log Transaksi Setoran */}
            <Card className="!overflow-visible relative z-30 dark:bg-slate-800 dark:border-slate-700">
                {/* Header Card & Filter Toolbar */}
                <div className="p-4 md:p-5 bg-white dark:bg-slate-800 rounded-t-3xl border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 relative z-30">
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
                            className: "w-44 text-xs",
                            render: (item: TransaksiSetoran) => (
                                <div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
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
                            className: "w-48 text-xs  font-medium text-slate-700 dark:text-slate-300",
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
                                Sisa Tunggakan Hari Ini:
                            </span>
                            <strong
                                className={`text-sm font-bold ${
                                    stats.sisaHariIni > 0
                                        ? "text-rose-500"
                                        : "text-emerald-500"
                                }`}
                            >
                                {formatRupiah(stats.sisaHariIni)}
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
                                            String(
                                                stats.sisaHariIni > 0
                                                    ? stats.sisaHariIni
                                                    : jukir.target_harian
                                            )
                                        )
                                    }
                                    className="text-[11px] font-semibold text-brand-blue-600 dark:text-brand-blue-400 hover:underline cursor-pointer"
                                >
                                    Isi Sesuai Target ({formatRupiah(jukir.target_harian)})
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
                onCancel={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                }}
                processing={isDeleting}
                confirmText="Ya, Batalkan Setoran"
                confirmVariant="danger"
            />
        </MainLayout>
    );
}