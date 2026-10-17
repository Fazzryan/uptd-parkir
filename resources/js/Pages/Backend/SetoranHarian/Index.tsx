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
    AlertTriangle,
    AlertCircle,
    Award,
    Phone,
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
    totalTunggakan?: number;
    jumlahJukirNunggak?: number;
    totalJukirWilayah?: number;
    namaWilayah?: string;
}

export interface TopJukirItem {
    rank: number;
    id: number;
    kode_jukir: string;
    nama: string;
    foto?: string | null;
    nohp?: string | null;
    titik_parkir: string;
    kecamatan: string;
    target_nominal: number;
    setor_nominal: number;
    tunggakan_nominal: number;
    persentase: number;
    status: "Lunas" | "Kurang" | "Nunggak";
    jam_bayar?: string | null;
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
    topDisiplin?: TopJukirItem[];
    topPerhatian?: TopJukirItem[];
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
    topDisiplin: initialTopDisiplin = [],
    topPerhatian: initialTopPerhatian = [],
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
            totalTunggakan: 0,
            jumlahJukirNunggak: 0,
            totalJukirWilayah: 0,
            namaWilayah: "",
        }
    );
    const [topDisiplin, setTopDisiplin] = useState<TopJukirItem[]>(initialTopDisiplin);
    const [topPerhatian, setTopPerhatian] = useState<TopJukirItem[]>(initialTopPerhatian);

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

    useEffect(() => {
        if (initialTopDisiplin) {
            setTopDisiplin(initialTopDisiplin);
        }
    }, [initialTopDisiplin]);

    useEffect(() => {
        if (initialTopPerhatian) {
            setTopPerhatian(initialTopPerhatian);
        }
    }, [initialTopPerhatian]);

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

    // Helper Format No WhatsApp
    const formatWaNumber = (phone?: string | null) => {
        if (!phone) return "";
        let clean = phone.replace(/[^0-9]/g, "");
        if (clean.startsWith("0")) {
            clean = "62" + clean.slice(1);
        }
        return clean;
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
                    if (res.data.topDisiplin) {
                        setTopDisiplin(res.data.topDisiplin);
                    }
                    if (res.data.topPerhatian) {
                        setTopPerhatian(res.data.topPerhatian);
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

            {/* 1. Filter Terpadu Wilayah & Periode (Diletakkan di Paling Atas Sebelum Card) */}
            <Card className="!overflow-visible mb-8 p-5 relative z-30 dark:bg-slate-800 dark:border-slate-700 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/80 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400">
                            <Filter size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Filter Wilayah & Periode Analitik
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Memfilter data statistik, sorotan kinerja jukir, dan rekapitulasi setoran
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Wilayah: <strong className="text-brand-blue-600 dark:text-brand-blue-400">{stats.namaWilayah || "Semua Wilayah"}</strong>
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-30 overflow-visible">
                    {/* Filter Kecamatan */}
                    <div className="w-full sm:w-56 relative z-30">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                            Kecamatan / Wilayah
                        </span>
                        <SelectSearch
                            options={kecamatanOptions}
                            value={String(selectedKecamatan)}
                            onChange={(val) => setSelectedKecamatan(val)}
                            placeholder="Semua Kecamatan..."
                        />
                    </div>

                    {/* Filter Periode */}
                    <div className="w-full sm:w-48 relative z-30">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                            Rentang Waktu
                        </span>
                        <SelectSearch
                            options={periodeOptions}
                            value={selectedPeriode}
                            onChange={(val) => setSelectedPeriode(String(val))}
                            placeholder="Pilih Periode..."
                        />
                    </div>

                    {/* Input Rentang Tanggal jika periode 'Rentang' */}
                    {selectedPeriode === "Rentang" && (
                        <div className="w-full sm:w-auto flex flex-col justify-end">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                                Dari — Sampai
                            </span>
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
                        </div>
                    )}

                    {/* Filter Status Setoran */}
                    <div className="w-full sm:w-44 relative z-30">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                            Status Setoran
                        </span>
                        <SelectSearch
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(val) => setSelectedStatus(String(val))}
                            placeholder="Semua Status..."
                        />
                    </div>

                    {/* Tombol Reset */}
                    {hasActiveFilter && (
                        <div className="flex flex-col justify-end pt-5">
                            <Button
                                variant="danger"
                                onClick={handleResetFilter}
                                className="flex items-center gap-1.5 whitespace-nowrap text-xs py-2 px-3 rounded-xl shadow-xs"
                            >
                                <RotateCcw size={15} />
                                <span>Reset Filter</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Badge Indikator Filter Aktif */}
                {hasActiveFilter && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-400 dark:text-slate-500 font-semibold text-[11px] uppercase mr-1">
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
            </Card>

            {/* 2. Grid 4 Kartu Statistik Pendapatan & Tunggakan (Sesuai Wilayah Terpilih) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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

                <StatCard
                    title="Total Tunggakan"
                    value={formatRupiahStrict(stats.totalTunggakan || 0)}
                    valueClassName="text-xl xl:text-2xl font-bold text-rose-600 dark:text-rose-400"
                    icon={AlertTriangle}
                    color="bg-rose-500"
                    className="border-l-4 border-rose-500"
                    period={selectedPeriode}
                    description={`${stats.jumlahJukirNunggak || 0} dari ${stats.totalJukirWilayah || 0} jukir belum lunas`}
                />
            </div>

            {/* 3. Sorotan Kinerja Jukir: Jukir Terdisiplin vs Jukir Perlu Perhatian (Top 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Kartu Kiri: Jukir Terdisiplin */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-brand-green-50 text-brand-green-600 dark:bg-brand-green-950/60 dark:text-brand-green-400">
                                <Award size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <span>Jukir Terdisiplin</span>
                                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-brand-green-100 text-brand-green-800 dark:bg-brand-green-900/50 dark:text-brand-green-300">
                                        Top 3
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                    Capaian setoran tertinggi & kepatuhan pelunasan di {stats.namaWilayah || "wilayah terpilih"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 divide-y divide-slate-100 dark:divide-slate-700/60">
                        {topDisiplin.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                                <Award size={28} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                Belum ada catatan setoran masuk pada periode ini.
                            </div>
                        ) : (
                            topDisiplin.map((item, idx) => {
                                const rankColors = [
                                    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700",
                                    "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600",
                                    "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700",
                                ];
                                return (
                                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${rankColors[idx] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                                {item.rank}
                                            </div>

                                            <img
                                                src={
                                                    item.foto
                                                        ? item.foto.startsWith("http") || item.foto.startsWith("/")
                                                            ? item.foto
                                                            : `/storage/${item.foto}`
                                                        : "/assets/images/dump.jpg"
                                                }
                                                alt={item.nama}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/assets/images/dump.jpg";
                                                }}
                                            />

                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                                                    {item.nama}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 truncate">
                                                    <span className="font-semibold text-brand-blue-600 dark:text-brand-blue-400">
                                                        {item.kode_jukir}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="truncate">{item.titik_parkir}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-brand-green-700 dark:text-brand-green-400 block">
                                                    {formatRupiahStrict(item.setor_nominal)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                                                    Target: {formatRupiahStrict(item.target_nominal)}
                                                </span>
                                            </div>

                                            <Badge type="success" className="text-[10px] py-0.5 px-2">
                                                {item.status}
                                            </Badge>

                                            <Link
                                                href={route("be.setoran-harian.detail-setoran", item.kode_jukir || item.id)}
                                                title="Lihat Detail Transaksi"
                                                className="p-1.5 text-slate-400 hover:text-brand-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <ArrowUpRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                {/* Kartu Kanan: Jukir Perlu Perhatian */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <span>Jukir Perlu Perhatian</span>
                                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                                        Prioritas Penagihan
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                    Tunggakan setoran tertinggi yang perlu ditindaklanjuti di {stats.namaWilayah || "wilayah terpilih"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 divide-y divide-slate-100 dark:divide-slate-700/60">
                        {topPerhatian.length === 0 ? (
                            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                                <CheckCircle2 size={28} className="mx-auto mb-2 text-brand-green-500" />
                                Seluruh jukir di wilayah ini telah melunasi target setoran.
                            </div>
                        ) : (
                            topPerhatian.map((item, idx) => {
                                return (
                                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                                                {item.rank}
                                            </div>

                                            <img
                                                src={
                                                    item.foto
                                                        ? item.foto.startsWith("http") || item.foto.startsWith("/")
                                                            ? item.foto
                                                            : `/storage/${item.foto}`
                                                        : "/assets/images/dump.jpg"
                                                }
                                                alt={item.nama}
                                                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/assets/images/dump.jpg";
                                                }}
                                            />

                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                                                    {item.nama}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 truncate">
                                                    <span className="font-semibold text-brand-blue-600 dark:text-brand-blue-400">
                                                        {item.kode_jukir}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="truncate">{item.titik_parkir}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 shrink-0">
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                                                    Kurang {formatRupiahStrict(item.tunggakan_nominal)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                                                    Setor: {formatRupiahStrict(item.setor_nominal)}
                                                </span>
                                            </div>

                                            <Badge type="danger" className="text-[10px] py-0.5 px-2">
                                                {item.status}
                                            </Badge>

                                            {item.nohp && (
                                                <a
                                                    href={`https://wa.me/${formatWaNumber(item.nohp)}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title={`Hubungi WhatsApp: ${item.nohp}`}
                                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                                                >
                                                    <Phone size={15} />
                                                </a>
                                            )}

                                            <Link
                                                href={route("be.setoran-harian.detail-setoran", item.kode_jukir || item.id)}
                                                title="Lihat Detail Transaksi"
                                                className="p-1.5 text-slate-400 hover:text-brand-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <ArrowUpRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>
            </div>

            {/* 4. Card Utama Pembungkus Tabel Data Jukir */}
            <Card className="overflow-hidden relative z-10 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Toolbar Tabel: Hanya Pencarian Jukir & Info Data */}
                <div className="p-4 md:p-5 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            className="w-full font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            placeholder="Cari nama jukir, kode, atau titik lokasi di wilayah ini..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Menampilkan <strong>{dataJukir.length}</strong> jukir di {stats.namaWilayah || "wilayah terpilih"}
                    </div>
                </div>

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