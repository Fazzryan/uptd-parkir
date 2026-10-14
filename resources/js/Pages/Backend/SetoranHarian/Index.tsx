import React, { useState, useMemo } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import StatCard from "@/Components/UI/SatistikCard";
import TextInput from "@/Components/Form/TextInput";
import SelectSearch from "@/Components/Form/SelectSearch";
import Modal from "@/Components/UI/Modal";
import { Head } from "@inertiajs/react";
import {
    Search,
    RotateCcw,
    Eye,
    Printer,
    MapPin,
    Building2,
    Calendar,
    Clock,
    X,
    FileSpreadsheet,
    FileText,
    Coins,
    TrendingUp,
    Wallet,
    Filter,
} from "lucide-react";

// Tipe Data Baris Kendali Setoran Jukir
interface MonitoringJukirRow {
    id: number;
    kode_jukir: string;
    nama: string;
    titik_parkir: string;
    kecamatan: string;
    target_harian: number;
    setor_hari_ini: number;
    jam_bayar?: string;
    status: "Lunas" | "Kurang" | "Nunggak";
    riwayat: {
        tanggal: string;
        target: number;
        setor: number;
        keterangan: string;
        status: "Lunas" | "Kurang" | "Nunggak";
        sisa_hutang: number;
    }[];
}

export default function Index() {
    // State Filter
    const [search, setSearch] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState<string | number>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedPeriode, setSelectedPeriode] = useState<string>("Hari Ini");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // State Modal Detail
    const [selectedJukir, setSelectedJukir] = useState<MonitoringJukirRow | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Opsi Periode untuk Komponen SelectSearch
    const periodeOptions = [
        { value: "Hari Ini", label: "Periode: Hari Ini" },
        { value: "Bulan Ini", label: "Periode: Bulan Ini" },
        { value: "Tahun Ini", label: "Periode: Tahun Ini" },
        { value: "Rentang", label: "Periode: Rentang Tanggal" },
    ];

    // Opsi Kecamatan untuk Komponen SelectSearch (Berdasarkan Sheet Excel UPTD)
    const kecamatanOptions = [
        { value: "", label: "Semua Kecamatan" },
        { value: "Singaparna", label: "Kec. Singaparna" },
        { value: "Ciawi", label: "Kec. Ciawi" },
        { value: "Manonjaya", label: "Kec. Manonjaya" },
        { value: "Rajapolah", label: "Kec. Rajapolah" },
        { value: "Cineam", label: "Kec. Cineam" },
        { value: "Sukaraja", label: "Kec. Sukaraja" },
        { value: "Karangnunggal", label: "Kec. Karangnunggal" },
        { value: "Bantarkalong", label: "Kec. Bantarkalong" },
        { value: "Cipatujah", label: "Kec. Cipatujah" },
    ];

    // Opsi Status untuk Komponen SelectSearch
    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "Lunas", label: "Status: Lunas" },
        { value: "Kurang", label: "Status: Kurang" },
        { value: "Nunggak", label: "Status: Nunggak" },
    ];

    // Data Dummy Realistis Sesuai Data Nyata Singaparna & Ciawi
    const [dataJukir] = useState<MonitoringJukirRow[]>([
        {
            id: 1,
            kode_jukir: "JKR-006",
            nama: "ADE IYO / UDIS",
            titik_parkir: "TK Pecah B Erna",
            kecamatan: "Singaparna",
            target_harian: 20000,
            setor_hari_ini: 0,
            jam_bayar: undefined,
            status: "Nunggak",
            riwayat: [
                {
                    tanggal: "12 Oct 2026",
                    target: 20000,
                    setor: 10000,
                    keterangan: "Kurang 10rb",
                    status: "Kurang",
                    sisa_hutang: 10000,
                },
                {
                    tanggal: "06 Oct 2026",
                    target: 20000,
                    setor: 20000,
                    keterangan: "Lunas",
                    status: "Lunas",
                    sisa_hutang: 0,
                },
            ],
        },
        {
            id: 2,
            kode_jukir: "JKR-007",
            nama: "DEDE S / DIDIN",
            titik_parkir: "TK Pecah B Erna",
            kecamatan: "Singaparna",
            target_harian: 14000,
            setor_hari_ini: 14000,
            jam_bayar: "08:45 WIB",
            status: "Lunas",
            riwayat: [
                {
                    tanggal: "14 Oct 2026",
                    target: 14000,
                    setor: 14000,
                    keterangan: "Lunas",
                    status: "Lunas",
                    sisa_hutang: 0,
                },
            ],
        },
        {
            id: 3,
            kode_jukir: "JKR-015",
            nama: "AHMAD MUZAKIR",
            titik_parkir: "Pontiari Tekstil",
            kecamatan: "Singaparna",
            target_harian: 14000,
            setor_hari_ini: 10000,
            jam_bayar: "10:15 WIB",
            status: "Kurang",
            riwayat: [
                {
                    tanggal: "14 Oct 2026",
                    target: 14000,
                    setor: 10000,
                    keterangan: "Kurang 4rb",
                    status: "Kurang",
                    sisa_hutang: 4000,
                },
            ],
        },
        {
            id: 4,
            kode_jukir: "JKR-010",
            nama: "ATEP GUSTIAWAN",
            titik_parkir: "TK H Ade Sobandi",
            kecamatan: "Singaparna",
            target_harian: 14000,
            setor_hari_ini: 0,
            jam_bayar: undefined,
            status: "Nunggak",
            riwayat: [],
        },
        {
            id: 5,
            kode_jukir: "JKR-004",
            nama: "CECE",
            titik_parkir: "TK Abang Ade",
            kecamatan: "Singaparna",
            target_harian: 14000,
            setor_hari_ini: 14000,
            jam_bayar: "11:30 WIB",
            status: "Lunas",
            riwayat: [
                {
                    tanggal: "14 Oct 2026",
                    target: 14000,
                    setor: 14000,
                    keterangan: "Lunas",
                    status: "Lunas",
                    sisa_hutang: 0,
                },
            ],
        },
        {
            id: 6,
            kode_jukir: "JKR-CAW-001",
            nama: "CECEP T S",
            titik_parkir: "IRMA Cell",
            kecamatan: "Ciawi",
            target_harian: 15000,
            setor_hari_ini: 15000,
            jam_bayar: "09:10 WIB",
            status: "Lunas",
            riwayat: [
                {
                    tanggal: "14 Oct 2026",
                    target: 15000,
                    setor: 15000,
                    keterangan: "Lunas",
                    status: "Lunas",
                    sisa_hutang: 0,
                },
            ],
        },
        {
            id: 7,
            kode_jukir: "JKR-CAW-002",
            nama: "JOJO S",
            titik_parkir: "Bank BRI",
            kecamatan: "Ciawi",
            target_harian: 15000,
            setor_hari_ini: 0,
            jam_bayar: undefined,
            status: "Nunggak",
            riwayat: [],
        },
    ]);

    // Format Rupiah
    const formatRupiah = (val?: number) => {
        if (!val || val === 0) return "—";
        return `Rp ${val.toLocaleString("id-ID")}`;
    };

    const formatRupiahStrict = (val: number) => {
        return `Rp ${val.toLocaleString("id-ID")}`;
    };

    // Filter Data Berdasarkan Search, SelectSearch Kecamatan, & SelectSearch Status
    const filteredJukir = useMemo(() => {
        return dataJukir.filter((item) => {
            const matchesKecamatan =
                !selectedKecamatan ||
                item.kecamatan.toLowerCase() === String(selectedKecamatan).toLowerCase();

            const matchesStatus =
                !selectedStatus || item.status === selectedStatus;

            const matchesSearch =
                item.nama.toLowerCase().includes(search.toLowerCase()) ||
                item.kode_jukir.toLowerCase().includes(search.toLowerCase()) ||
                item.titik_parkir.toLowerCase().includes(search.toLowerCase());

            return matchesKecamatan && matchesStatus && matchesSearch;
        });
    }, [dataJukir, selectedKecamatan, selectedStatus, search]);

    // Perhitungan Statistik Pendapatan Ringkasan
    const statsPendapatan = useMemo(() => {
        const totalSetorHariIni = filteredJukir.reduce((acc, curr) => acc + curr.setor_hari_ini, 0);
        const targetHariIni = filteredJukir.reduce((acc, curr) => acc + curr.target_harian, 0);
        const persentase = targetHariIni > 0 ? Math.round((totalSetorHariIni / targetHariIni) * 100) : 0;

        return {
            hariIni: totalSetorHariIni,
            targetHariIni,
            persentase,
            bulanIni: 84650000,
            tahunIni: 925400000,
        };
    }, [filteredJukir]);

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
        setSelectedKecamatan("");
        setSelectedStatus("");
        setSelectedPeriode("Hari Ini");
        setStartDate("");
        setEndDate("");
    };

    const handleOpenDetail = (item: MonitoringJukirRow) => {
        setSelectedJukir(item);
        setShowDetailModal(true);
    };

    return (
        <MainLayout>
            <Head title="Daftar Pembayaran Retribusi Parkir" />

            {/* Header Section (Sesuai Desain Standar) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Daftar Pembayaran Retribusi Parkir
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kendali setoran harian per juru parkir di wilayah Kabupaten Tasikmalaya
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
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

            {/* Grid Kartu Statistik Pendapatan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <StatCard
                    title="Pendapatan Hari Ini"
                    value={formatRupiahStrict(statsPendapatan.hariIni)}
                    valueClassName="text-xl xl:text-2xl font-bold"
                    icon={Coins}
                    color="bg-brand-blue-500"
                    className="border-l-4 border-brand-blue-500"
                    period={selectedPeriode === "Rentang" ? (startDate && endDate ? `${startDate} s/d ${endDate}` : "Rentang") : selectedPeriode}
                    description={`${statsPendapatan.persentase}% tercapai (target ${formatRupiahStrict(statsPendapatan.targetHariIni)})`}
                />

                <StatCard
                    title="Pendapatan Bulan Ini"
                    value={formatRupiahStrict(statsPendapatan.bulanIni)}
                    valueClassName="text-xl xl:text-2xl font-bold"
                    icon={TrendingUp}
                    color="bg-brand-green-500"
                    className="border-l-4 border-brand-green-500"
                    period="Oktober 2026"
                    description="Target: Rp 110 Jt (77%)"
                />

                <StatCard
                    title="Pendapatan Tahun Ini"
                    value={formatRupiahStrict(statsPendapatan.tahunIni)}
                    valueClassName="text-xl xl:text-2xl font-bold"
                    icon={Wallet}
                    color="bg-amber-500"
                    className="border-l-4 border-amber-500"
                    period="Tahun 2026"
                    description="Target PAD: Rp 1,2 M (77,1%)"
                />
            </div>

            {/* Card Utama Pembungkus Filter & Tabel (Standar desain.md) */}
            <Card className="!overflow-visible relative z-30 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Toolbar Filter Terpadu (Satu Baris Sejajar & Rapi) */}
                <div className="p-4 md:p-5 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-3 relative z-30 overflow-visible">
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

                    {/* 3. Input Rentang Tanggal Menggunakan Komponen TextInput */}
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
                            value={selectedKecamatan}
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

                        {/* Badge Periode Aktif */}
                        <Badge type="info" className="gap-1.5 pl-2.5 pr-2 py-1 normal-case tracking-normal text-xs font-semibold">
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

                        {/* Badge Kata Kunci / Search */}
                        {search && (
                            <Badge type="default" className="gap-1.5 pl-2.5 pr-1.5 py-1 normal-case tracking-normal text-xs font-semibold">
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
                            <Badge type="info" className="gap-1.5 pl-2.5 pr-1.5 py-1 normal-case tracking-normal text-xs font-semibold">
                                <span>
                                    Kecamatan: <strong>{selectedKecamatan}</strong>
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
                            header: "TARGET & SETORAN HARI INI",
                            className: "w-50 text-xs",
                            render: (item: MonitoringJukirRow) => {
                                const targetNominal =
                                    selectedPeriode === "Bulan Ini"
                                        ? item.target_harian * 26
                                        : selectedPeriode === "Tahun Ini"
                                        ? item.target_harian * 312
                                        : item.target_harian;

                                const setorNominal =
                                    selectedPeriode === "Bulan Ini"
                                        ? item.setor_hari_ini * 24
                                        : selectedPeriode === "Tahun Ini"
                                        ? item.setor_hari_ini * 280
                                        : item.setor_hari_ini;

                                return (
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 w-11">
                                                Target:
                                            </span>
                                            <span>{formatRupiahStrict(targetNominal)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 w-11">
                                                Setor:
                                            </span>
                                            {setorNominal > 0 ? (
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {formatRupiahStrict(setorNominal)}
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
                                const targetNominal =
                                    selectedPeriode === "Bulan Ini"
                                        ? item.target_harian * 26
                                        : selectedPeriode === "Tahun Ini"
                                        ? item.target_harian * 312
                                        : item.target_harian;

                                const setorNominal =
                                    selectedPeriode === "Bulan Ini"
                                        ? item.setor_hari_ini * 24
                                        : selectedPeriode === "Tahun Ini"
                                        ? item.setor_hari_ini * 280
                                        : item.setor_hari_ini;

                                const sisa = targetNominal - setorNominal;
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
                            className: "w-40 text-xs text-slate-400 dark:text-slate-500",
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
                            header: "DETAIL",
                            className: "w-20 text-center",
                            headerClassName: "text-center w-20",
                            render: (item: MonitoringJukirRow) => (
                                <button
                                    onClick={() => handleOpenDetail(item)}
                                    title="Lihat Buku Catatan Setoran"
                                    className="p-2 text-slate-400 hover:text-brand-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
                                >
                                    <Eye size={17} />
                                </button>
                            ),
                        },
                    ]}
                    data={filteredJukir}
                    keyExtractor={(item) => item.id}
                    emptyMessage="Tidak ada data juru parkir yang cocok dengan filter yang dipilih."
                />

                {/* Footer Informasi Data */}
                <div className="p-5 border-t border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        Menampilkan <strong className="text-slate-800 dark:text-slate-200">{filteredJukir.length}</strong> juru parkir
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Total Setoran:{" "}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {formatRupiahStrict(
                                filteredJukir.reduce((acc, curr) => acc + curr.setor_hari_ini, 0)
                            )}
                        </span>
                    </span>
                </div>
            </Card>

            {/* Modal Detail Buku Catatan & Alokasi Pembayaran (Sesuai Referensi Gambar 1) */}
            <Modal
                show={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Buku Catatan Pembayaran Jukir"
                maxWidth="2xl"
            >
                {selectedJukir && (
                    <div className="p-6 space-y-6">
                        {/* Header Modal Info Jukir */}
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge type="info">{selectedJukir.kode_jukir}</Badge>
                                    <Badge type="default">{selectedJukir.kecamatan}</Badge>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {selectedJukir.nama}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <MapPin size={13} className="text-slate-400" />
                                    <span>{selectedJukir.titik_parkir}</span>
                                </p>
                            </div>
                        </div>

                        {/* 3 Box Ringkasan (Target Harian, Setor Hari Ini, Sisa Tunggakan) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                                    Target Harian
                                </span>
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                                    {formatRupiahStrict(selectedJukir.target_harian)}
                                </p>
                            </div>

                            <div>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                                    Setor Hari Ini
                                </span>
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                                    {formatRupiah(selectedJukir.setor_hari_ini)}
                                </p>
                            </div>

                            <div>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                                    Sisa Tunggakan
                                </span>
                                <p className="text-lg font-bold text-rose-500 mt-0.5">
                                    {formatRupiahStrict(selectedJukir.target_harian - selectedJukir.setor_hari_ini)}
                                </p>
                            </div>
                        </div>

                        {/* Tabel Riwayat Alokasi Pembayaran */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Buku Catatan & Alokasi Pembayaran
                            </h3>

                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-4 py-3">Tanggal</th>
                                            <th className="px-4 py-3">Target</th>
                                            <th className="px-4 py-3">Setor QRIS / Tunai</th>
                                            <th className="px-4 py-3">Keterangan Alokasi</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                            <th className="px-4 py-3 text-right">Sisa Hutang</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                        {selectedJukir.riwayat.length > 0 ? (
                                            selectedJukir.riwayat.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/40">
                                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                                                        {row.tanggal}
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                                                        {formatRupiahStrict(row.target)}
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                                                        {formatRupiahStrict(row.setor)}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                                                        {row.keterangan}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {row.status === "Lunas" ? (
                                                            <Badge type="success">Lunas</Badge>
                                                        ) : (
                                                            <Badge type="warning">Kurang</Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold">
                                                        <span className={row.sisa_hutang > 0 ? "text-rose-500" : "text-emerald-500"}>
                                                            {formatRupiahStrict(row.sisa_hutang)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-6 text-center text-slate-400 dark:text-slate-500 italic"
                                                >
                                                    Belum ada riwayat setoran sebelumnya.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    alert(
                                        `Mencetak Surat Peringatan Tunggakan untuk Jukir: ${selectedJukir.nama}`
                                    )
                                }
                                className="flex items-center gap-2 text-xs"
                            >
                                <Printer size={15} />
                                <span>Cetak Riwayat / Surat Peringatan</span>
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => setShowDetailModal(false)}
                                className="text-xs px-4 py-2"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </MainLayout>
    );
}