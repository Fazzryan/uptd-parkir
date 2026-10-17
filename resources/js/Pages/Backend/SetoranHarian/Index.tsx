import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import {
    Search,
    RotateCcw,
    Eye,
    Printer,
    MapPin,
    Calendar,
    Clock,
    X,
    FileSpreadsheet,
    FileText,
    Coins,
    TrendingUp,
    Wallet,
    Filter,
    Plus,
    Banknote,
    Trash2,
    CheckCircle2,
    ArrowUpRight,
} from "lucide-react";
import { Kecamatan } from "@/types/model";
import axios from "axios";

// Tipe Data Baris Kendali Setoran Jukir
export interface RiwayatSetoranItem {
    id: number;
    kode_transaksi: string;
    tanggal: string;
    raw_tanggal: string;
    jam?: string;
    target: number;
    setor: number;
    metode_pembayaran: string;
    keterangan: string;
    status: "Lunas" | "Kurang" | "Nunggak";
    sisa_hutang: number;
}

export interface MonitoringJukirRow {
    id: number;
    kode_jukir: string;
    nama: string;
    titik_parkir: string;
    kecamatan: string;
    kecamatan_id?: number | null;
    target_harian: number;
    target_nominal: number;
    setor_hari_ini: number;
    jam_bayar?: string | null;
    status: "Lunas" | "Kurang" | "Nunggak";
    riwayat: RiwayatSetoranItem[];
}

export interface StatsSummary {
    hariIni: number;
    targetHariIni: number;
    persentaseHariIni: number;
    bulanIni: number;
    targetBulanIni: number;
    persentaseBulanIni: number;
    tahunIni: number;
    targetTahunIni: number;
    persentaseTahunIni: number;
}

export interface JukirOption {
    id: number;
    nama: string;
    kode_jukir: string;
    target_harian: number;
    titik_parkir: string;
    kecamatan: string;
}

interface IndexProps {
    initialDataJukir?: MonitoringJukirRow[];
    stats?: StatsSummary;
    kecamatanList?: Kecamatan[];
    allJukirOptions?: JukirOption[];
    filters?: {
        search?: string;
        kecamatan_id?: string | number;
        periode?: string;
        start_date?: string;
        end_date?: string;
        status?: string;
    };
    defaultKecamatanId?: string | number;
}

export default function Index({
    initialDataJukir = [],
    stats: serverStats,
    kecamatanList = [],
    allJukirOptions = [],
    filters = {},
    defaultKecamatanId = "",
}: IndexProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const canCreateSetoran =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("create-setoran-harian");

    // State Data & Statistik dari Server
    const [dataJukir, setDataJukir] = useState<MonitoringJukirRow[]>(initialDataJukir);
    const [stats, setStats] = useState<StatsSummary>(
        serverStats || {
            hariIni: 0,
            targetHariIni: 0,
            persentaseHariIni: 0,
            bulanIni: 0,
            targetBulanIni: 0,
            persentaseBulanIni: 0,
            tahunIni: 0,
            targetTahunIni: 0,
            persentaseTahunIni: 0,
        }
    );

    // State Filter
    const [search, setSearch] = useState(filters.search || "");
    const [selectedKecamatan, setSelectedKecamatan] = useState<string | number>(
        filters.kecamatan_id || ""
    );
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || "");
    const [selectedPeriode, setSelectedPeriode] = useState<string>(
        filters.periode || "Hari Ini"
    );
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    const [isLoading, setIsLoading] = useState(false);

    // State Modal Catat Setoran Tunai
    const [showSetorModal, setShowSetorModal] = useState(false);

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
        jukir_id: "" as number | string,
        tanggal: new Date().toISOString().split("T")[0],
        jam: new Date().toTimeString().slice(0, 5),
        nominal_setor: "" as number | string,
        metode_pembayaran: "Tunai",
        keterangan: "",
    });

    // Sinkronisasi data saat props awal berubah
    useEffect(() => {
        setDataJukir(initialDataJukir);
    }, [initialDataJukir]);

    useEffect(() => {
        if (serverStats) {
            setStats(serverStats);
        }
    }, [serverStats]);

    // Opsi Periode untuk Komponen SelectSearch
    const periodeOptions = [
        { value: "Hari Ini", label: "Periode: Hari Ini" },
        { value: "Bulan Ini", label: "Periode: Bulan Ini" },
        { value: "Tahun Ini", label: "Periode: Tahun Ini" },
        { value: "Rentang", label: "Periode: Rentang Tanggal" },
    ];

    // Opsi Kecamatan untuk Komponen SelectSearch
    const kecamatanOptions = [
        { value: "", label: "Semua Kecamatan" },
        ...kecamatanList.map((k) => ({
            value: String(k.id),
            label: `Kec. ${k.nama_kecamatan}`,
        })),
    ];

    // Opsi Status untuk Komponen SelectSearch
    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "Lunas", label: "Status: Lunas" },
        { value: "Kurang", label: "Status: Kurang" },
        { value: "Nunggak", label: "Status: Nunggak" },
    ];

    // Opsi Jukir untuk Dropdown Modal Setor Tunai
    const jukirDropdownOptions = allJukirOptions.map((j) => ({
        value: String(j.id),
        label: `${j.kode_jukir ? `[${j.kode_jukir}] ` : ""}${j.nama} - ${j.titik_parkir} (${j.kecamatan})`,
    }));

    // Format Rupiah
    const formatRupiah = (val?: number) => {
        if (!val || val === 0) return "—";
        return `Rp ${Number(val).toLocaleString("id-ID")}`;
    };

    const formatRupiahStrict = (val: number) => {
        return `Rp ${Number(val).toLocaleString("id-ID")}`;
    };

    // Fungsi Fetching Data AJAX dengan Debounce
    const isFirstRender = useRef(true);

    const fetchData = (overrideParams: Record<string, any> = {}) => {
        setIsLoading(true);
        const params = {
            search,
            kecamatan_id: selectedKecamatan,
            status: selectedStatus,
            periode: selectedPeriode,
            start_date: startDate,
            end_date: endDate,
            ...overrideParams,
        };

        axios
            .get(route("be.setoran-harian.index"), {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data) {
                    setDataJukir(res.data.dataJukir || []);
                    if (res.data.stats) {
                        setStats(res.data.stats);
                    }
                }
            })
            .catch((err) => console.error("Error fetching data setoran:", err))
            .finally(() => setIsLoading(false));
    };

    // Efek debounce saat filter berubah
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, selectedKecamatan, selectedStatus, selectedPeriode, startDate, endDate]);

    // Status apakah ada filter yang sedang aktif
    const hasActiveFilter = Boolean(
        search ||
        selectedKecamatan ||
        selectedStatus ||
        selectedPeriode !== "Hari Ini" ||
        startDate ||
        endDate
    );

    const handleResetFilter = () => {
        setSearch("");
        setSelectedKecamatan(defaultKecamatanId ? String(defaultKecamatanId) : "");
        setSelectedStatus("");
        setSelectedPeriode("Hari Ini");
        setStartDate("");
        setEndDate("");
    };

    // Buka Modal Catat Setoran Tunai (Bisa dari tombol toolbar atau baris tabel)
    const handleOpenSetorModal = (item?: MonitoringJukirRow) => {
        clearErrors();
        resetForm();

        const todayStr = new Date().toISOString().split("T")[0];
        const timeStr = new Date().toTimeString().slice(0, 5);

        if (item) {
            // Jika diklik langsung dari baris tabel jukir
            const targetHarian = item.target_harian || 0;
            const belumSetor = Math.max(0, targetHarian - item.setor_hari_ini);

            setFormData({
                jukir_id: item.id,
                tanggal: todayStr,
                jam: timeStr,
                nominal_setor: belumSetor > 0 ? String(belumSetor) : String(targetHarian),
                metode_pembayaran: "Tunai",
                keterangan: "Setoran tunai harian",
            });
        } else {
            // Jika diklik dari tombol toolbar atas
            setFormData({
                jukir_id: allJukirOptions.length > 0 ? allJukirOptions[0].id : "",
                tanggal: todayStr,
                jam: timeStr,
                nominal_setor: allJukirOptions.length > 0 ? String(allJukirOptions[0].target_harian) : "",
                metode_pembayaran: "Tunai",
                keterangan: "Setoran tunai harian",
            });
        }

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

    // Data Jukir Terpilih di Form Modal Setoran
    const selectedJukirInForm = useMemo(() => {
        return allJukirOptions.find((j) => String(j.id) === String(formData.jukir_id));
    }, [formData.jukir_id, allJukirOptions]);

    return (
        <MainLayout>
            <Head title="Daftar Pembayaran Retribusi Parkir" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        Daftar Pembayaran Retribusi Parkir
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kendali setoran harian per juru parkir di wilayah Kabupaten Tasikmalaya
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {canCreateSetoran && (
                        <Button
                            variant="primary"
                            onClick={() => handleOpenSetorModal()}
                            className="flex items-center gap-2 shadow-sm"
                        >
                            <Plus size={16} />
                            <span>Catat Setoran Tunai</span>
                        </Button>
                    )}

                    <Button
                        variant="danger"
                        onClick={() => alert("Mengekspor laporan ke format PDF")}
                        className="flex items-center gap-2 shadow-sm"
                    >
                        <FileText size={16} />
                        <span>Export PDF</span>
                    </Button>

                    <Button
                        variant="success"
                        onClick={() => alert("Mengekspor data ke format Excel")}
                        className="flex items-center gap-2 shadow-sm"
                    >
                        <FileSpreadsheet size={16} />
                        <span>Export Excel</span>
                    </Button>
                </div>
            </div>

            {/* Grid Kartu Statistik Pendapatan (Realtime dari Database) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <StatCard
                    title="Pendapatan Hari Ini"
                    value={formatRupiahStrict(stats.hariIni)}
                    valueClassName="text-xl xl:text-2xl font-bold"
                    icon={Coins}
                    color="bg-brand-blue-500"
                    className="border-l-4 border-brand-blue-500"
                    period={
                        selectedPeriode === "Rentang"
                            ? startDate && endDate
                                ? `${startDate} s/d ${endDate}`
                                : "Rentang"
                            : selectedPeriode
                    }
                    description={`${stats.persentaseHariIni}% tercapai (Target: ${formatRupiahStrict(
                        stats.targetHariIni
                    )})`}
                />

                <StatCard
                    title="Pendapatan Bulan Ini"
                    value={formatRupiahStrict(stats.bulanIni)}
                    valueClassName="text-xl xl:text-2xl font-bold"
                    icon={TrendingUp}
                    color="bg-brand-green-500"
                    className="border-l-4 border-brand-green-500"
                    period={`Bulan Ini`}
                    description={`${stats.persentaseBulanIni}% tercapai (Target: ${formatRupiahStrict(
                        stats.targetBulanIni
                    )})`}
                />

                <StatCard
                    title="Pendapatan Tahun Ini"
                    value={formatRupiahStrict(stats.tahunIni)}
                    valueClassName="text-xl xl:text-2xl font-bold"
                    icon={Wallet}
                    color="bg-amber-500"
                    className="border-l-4 border-amber-500"
                    period={`Tahun ${new Date().getFullYear()}`}
                    description={`${stats.persentaseTahunIni}% tercapai (Target PAD: ${formatRupiahStrict(
                        stats.targetTahunIni
                    )})`}
                />
            </div>

            {/* Card Utama Pembungkus Filter & Tabel */}
            <Card className="!overflow-visible relative z-30 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Toolbar Filter Terpadu */}
                <div className="p-4 md:p-5 bg-white dark:bg-slate-800 rounded-t-3xl border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-3 relative z-30 overflow-visible">
                    {/* 1. Input Pencarian */}
                    <div className="relative flex-1 min-w-[220px]">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            className="w-full font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            placeholder="Cari nama jukir, kode, atau titik lokasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* 2. Filter Periode */}
                    <div className="w-full sm:w-48 relative z-30">
                        <SelectSearch
                            options={periodeOptions}
                            value={selectedPeriode}
                            onChange={(val) => setSelectedPeriode(String(val))}
                            placeholder="Pilih Periode..."
                        />
                    </div>

                    {/* 3. Input Rentang Tanggal jika periode 'Rentang' */}
                    {selectedPeriode === "Rentang" && (
                        <div className="flex items-center gap-2 animate-in fade-in duration-200">
                            <div className="w-36 sm:w-40">
                                <TextInput
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    containerClassName="relative w-full"
                                    className="text-xs py-2 font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 cursor-pointer"
                                />
                            </div>
                            <span className="text-slate-400 text-xs font-bold">—</span>
                            <div className="w-36 sm:w-40">
                                <TextInput
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    containerClassName="relative w-full"
                                    className="text-xs py-2 font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {/* 4. Filter Kecamatan */}
                    <div className="w-full sm:w-48 relative z-30">
                        <SelectSearch
                            options={kecamatanOptions}
                            value={String(selectedKecamatan)}
                            onChange={(val) => setSelectedKecamatan(val)}
                            placeholder="Semua Kecamatan..."
                        />
                    </div>

                    {/* 5. Filter Status */}
                    <div className="w-full sm:w-40 relative z-30">
                        <SelectSearch
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(val) => setSelectedStatus(String(val))}
                            placeholder="Semua Status..."
                        />
                    </div>

                    {/* 6. Tombol Reset Filter */}
                    {hasActiveFilter && (
                        <Button
                            variant="danger"
                            onClick={handleResetFilter}
                            className="flex items-center gap-1.5 whitespace-nowrap text-xs py-2 px-3 rounded-xl shadow-xs"
                        >
                            <RotateCcw size={15} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                {/* Baris Badge Indikator Filter yang Sedang Aktif */}
                {hasActiveFilter && (
                    <div className="px-4 md:px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center gap-2 text-xs animate-in fade-in duration-150">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
                            <Filter size={13} className="text-brand-blue-500" />
                            Filter Aktif:
                        </span>

                        {/* Badge Periode */}
                        <Badge
                            type="info"
                            className="gap-1.5 pl-2.5 pr-2 py-1 normal-case tracking-normal text-xs font-semibold"
                        >
                            <span>
                                Periode:{" "}
                                <strong>
                                    {selectedPeriode === "Rentang"
                                        ? startDate && endDate
                                            ? `${startDate} s/d ${endDate}`
                                            : "Rentang Tanggal"
                                        : selectedPeriode}
                                </strong>
                            </span>
                        </Badge>

                        {/* Badge Pencarian */}
                        {search && (
                            <Badge
                                type="default"
                                className="gap-1.5 pl-2.5 pr-1.5 py-1 normal-case tracking-normal text-xs font-semibold"
                            >
                                <span>
                                    Pencarian: <strong>"{search}"</strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                    title="Hapus filter pencarian"
                                >
                                    <X size={12} />
                                </button>
                            </Badge>
                        )}

                        {/* Badge Kecamatan */}
                        {selectedKecamatan && (
                            <Badge
                                type="info"
                                className="gap-1.5 pl-2.5 pr-1.5 py-1 normal-case tracking-normal text-xs font-semibold"
                            >
                                <span>
                                    Kecamatan:{" "}
                                    <strong>
                                        {kecamatanList.find((k) => String(k.id) === String(selectedKecamatan))
                                            ?.nama_kecamatan || selectedKecamatan}
                                    </strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedKecamatan("")}
                                    className="p-0.5 hover:bg-brand-blue-100 dark:hover:bg-brand-blue-800 rounded-full text-brand-blue-500 hover:text-brand-blue-800 transition-colors cursor-pointer"
                                    title="Hapus filter kecamatan"
                                >
                                    <X size={12} />
                                </button>
                            </Badge>
                        )}

                        {/* Badge Status */}
                        {selectedStatus && (
                            <Badge
                                type={
                                    selectedStatus === "Lunas"
                                        ? "success"
                                        : selectedStatus === "Kurang"
                                        ? "warning"
                                        : "danger"
                                }
                                className="gap-1.5 pl-2.5 pr-1.5 py-1 normal-case tracking-normal text-xs font-semibold"
                            >
                                <span>
                                    Status: <strong>{selectedStatus}</strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus("")}
                                    className="p-0.5 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
                                    title="Hapus filter status"
                                >
                                    <X size={12} />
                                </button>
                            </Badge>
                        )}
                    </div>
                )}

                {/* Tabel Data Setoran */}
                <Table
                    columns={[
                        {
                            header: "#",
                            className: "text-center text-sm font-medium text-slate-400 dark:text-slate-300 w-14",
                            headerClassName: "text-center w-14",
                            render: (_: MonitoringJukirRow, index: number) => index + 1,
                        },
                        {
                            header: "JURU PARKIR",
                            className: "w-64",
                            render: (item: MonitoringJukirRow) => (
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-brand-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                        {item.nama.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-xs text-slate-800 dark:text-slate-100 leading-tight">
                                            {item.nama}
                                        </p>
                                        <span className="text-[11px] font-semibold text-brand-blue-600 dark:text-brand-blue-400">
                                            {item.kode_jukir}
                                        </span>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "TITIK PARKIR",
                            className: "w-80 text-xs text-slate-700 dark:text-slate-300 font-medium",
                            render: (item: MonitoringJukirRow) => (
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">
                                        {item.titik_parkir}
                                    </p>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                        Kec. {item.kecamatan}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            header: "TARGET & SETORAN",
                            className: "w-52 text-xs",
                            render: (item: MonitoringJukirRow) => {
                                return (
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 w-11">
                                                Target:
                                            </span>
                                            <span>{formatRupiahStrict(item.target_nominal)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 w-11">
                                                Setor:
                                            </span>
                                            {item.setor_hari_ini > 0 ? (
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {formatRupiahStrict(item.setor_hari_ini)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 dark:text-slate-500 font-normal">
                                                    —
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            },
                        },
                        {
                            header: "TUNGGAKAN",
                            className: "w-36 text-xs font-bold",
                            render: (item: MonitoringJukirRow) => {
                                const sisa = Math.max(0, item.target_nominal - item.setor_hari_ini);
                                return (
                                    <span
                                        className={
                                            sisa > 0
                                                ? "text-rose-500 font-bold"
                                                : "text-emerald-500 font-bold"
                                        }
                                    >
                                        {formatRupiahStrict(sisa)}
                                    </span>
                                );
                            },
                        },
                        {
                            header: "JAM BAYAR",
                            className: "w-36 text-xs text-slate-500 dark:text-slate-400",
                            render: (item: MonitoringJukirRow) => item.jam_bayar || "—",
                        },
                        {
                            header: "STATUS",
                            className: "w-28 text-center",
                            headerClassName: "text-center w-28",
                            render: (item: MonitoringJukirRow) => {
                                if (item.status === "Lunas") {
                                    return <Badge type="success">Lunas</Badge>;
                                }
                                if (item.status === "Kurang") {
                                    return <Badge type="warning">Kurang</Badge>;
                                }
                                return <Badge type="danger">Nunggak</Badge>;
                            },
                        },
                        {
                            header: "AKSI",
                            className: "w-28 text-center",
                            headerClassName: "text-center w-28",
                            render: (item: MonitoringJukirRow) => (
                                <div className="flex items-center justify-center gap-1.5">
                                    {canCreateSetoran && (
                                        <button
                                            onClick={() => handleOpenSetorModal(item)}
                                            title="Catat Setoran Tunai untuk Jukir ini"
                                            className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-lg transition-colors cursor-pointer active:scale-95"
                                        >
                                            <Banknote size={16} />
                                        </button>
                                    )}

                                    <Link
                                        href={route("be.setoran-harian.detail-setoran", item.kode_jukir || item.id)}
                                        title="Lihat Buku Catatan & Riwayat Setoran"
                                        className="p-1.5 text-slate-500 hover:text-brand-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer active:scale-95 inline-flex items-center"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                </div>
                            ),
                        },
                    ]}
                    data={dataJukir}
                    keyExtractor={(item) => item.id}
                    emptyMessage="Tidak ada data juru parkir yang cocok dengan filter yang dipilih."
                />

                {/* Footer Informasi Data */}
                <div className="p-5 bg-white dark:bg-slate-800 rounded-b-3xl border-t border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        Menampilkan{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                            {dataJukir.length}
                        </strong>{" "}
                        juru parkir
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Total Setoran Tercatat:{" "}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {formatRupiahStrict(
                                dataJukir.reduce((acc, curr) => acc + curr.setor_hari_ini, 0)
                            )}
                        </span>
                    </span>
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
                                Catat Setoran Tunai Manual
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                Penerimaan uang retribusi fisik dari juru parkir ke kas UPTD
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
                    {/* Pilih Jukir */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                            Pilih Juru Parkir <span className="text-rose-500">*</span>
                        </label>
                        <SelectSearch
                            options={jukirDropdownOptions}
                            value={String(formData.jukir_id)}
                            onChange={(val) => {
                                setFormData("jukir_id", val);
                                const found = allJukirOptions.find((j) => String(j.id) === String(val));
                                if (found) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        jukir_id: val,
                                        nominal_setor: String(found.target_harian),
                                    }));
                                }
                            }}
                            placeholder="Cari atau pilih juru parkir..."
                        />
                        {errors.jukir_id && (
                            <p className="text-xs text-rose-500 mt-1">{errors.jukir_id}</p>
                        )}
                    </div>

                    {/* Informasi Target Jukir Terpilih */}
                    {selectedJukirInForm && (
                        <div className="p-3 bg-brand-blue-50/70 dark:bg-slate-700/50 rounded-xl border border-brand-blue-100 dark:border-slate-600 flex items-center justify-between text-xs">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400 block">
                                    Lokasi Penugasan:
                                </span>
                                <strong className="text-slate-800 dark:text-slate-200">
                                    {selectedJukirInForm.titik_parkir} (Kec. {selectedJukirInForm.kecamatan})
                                </strong>
                            </div>
                            <div className="text-right">
                                <span className="text-slate-500 dark:text-slate-400 block">
                                    Target Harian:
                                </span>
                                <strong className="text-brand-blue-600 dark:text-brand-blue-400 font-bold">
                                    {formatRupiahStrict(selectedJukirInForm.target_harian)}
                                </strong>
                            </div>
                        </div>
                    )}

                    {/* Tanggal & Jam Setoran */}
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
                            {selectedJukirInForm && selectedJukirInForm.target_harian > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(
                                            "nominal_setor",
                                            String(selectedJukirInForm.target_harian)
                                        )
                                    }
                                    className="text-[11px] font-semibold text-brand-blue-600 hover:underline cursor-pointer"
                                >
                                    Isi Sesuai Target (Rp {selectedJukirInForm.target_harian.toLocaleString("id-ID")})
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

                    {/* Catatan / Keterangan */}
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
        </MainLayout>
    );
}