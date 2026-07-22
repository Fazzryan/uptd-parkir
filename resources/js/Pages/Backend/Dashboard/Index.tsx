import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import StatCard from "@/Components/UI/SatistikCard";
import Card from "@/Components/UI/Card";
import ChartBar from "@/Components/Data/Charts/ChartBar";
import ChartPie from "@/Components/Data/Charts/ChartPie";
import { Head } from "@inertiajs/react";
import {
    MapPin,
    Receipt,
    Network,
    Newspaper,
    LucideIcon,
    BarChart3,
    PieChart as PieIcon,
} from "lucide-react";

interface StatsProps {
    total_wilayah: number;
    total_kecamatan: number;
    total_panduan: number;
    total_tarif: number;
    total_personel: number;
    total_galeri: number;
    total_berita: number;
}

interface StatItem {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    className?: string;
    textColor: string;
    description: string;
    period?: string;
}

interface IndexProps {
    stats?: StatsProps;
    barData?: any[];
    pieData?: any[];
}

export default function Dashboard({
    stats: serverStats,
    barData: serverBarData,
    pieData: serverPieData,
}: IndexProps) {
    const totalWilayah = serverStats?.total_wilayah ?? 15;
    const totalKecamatan = serverStats?.total_kecamatan ?? 39;
    const totalTarif = serverStats?.total_tarif ?? 3;
    const totalPersonel = serverStats?.total_personel ?? 6;
    const totalGaleri = serverStats?.total_galeri ?? 6;
    const totalBerita = serverStats?.total_berita ?? 3;

    const statCards: StatItem[] = [
        {
            title: "Wilayah Parkir",
            value: totalWilayah,
            icon: MapPin,
            color: "bg-blue-500",
            className: "border-l-4 border-blue-500",
            textColor: "white",
            description: `Di ${totalKecamatan} Kecamatan`,
            period: "Kab. Tasikmalaya",
        },
        {
            title: "Tarif & Karcis",
            value: totalTarif,
            icon: Receipt,
            color: "bg-emerald-500",
            className: "border-l-4 border-emerald-500",
            textColor: "white",
            description: "Kategori Kendaraan",
            period: "Perda Resmi",
        },
        {
            title: "Personel UPTD",
            value: totalPersonel,
            icon: Network,
            color: "bg-indigo-500",
            className: "border-l-4 border-indigo-500",
            textColor: "white",
            description: "Pimpinan & Kolektor",
            period: "Struktur Aktif",
        },
        {
            title: "Galeri & Berita",
            value: totalGaleri + totalBerita,
            icon: Newspaper,
            color: "bg-amber-500",
            className: "border-l-4 border-amber-500",
            textColor: "white",
            description: `${totalGaleri} Foto / ${totalBerita} Berita`,
            period: "Informasi Publik",
        },
    ];

    const barData = serverBarData || [
        { name: "Singaparna", doc: 4 },
        { name: "Rajapolah", doc: 3 },
        { name: "Manonjaya", doc: 2 },
        { name: "Ciawi", doc: 2 },
        { name: "Taraju", doc: 1 },
    ];

    const pieData = serverPieData || [
        { name: "Wilayah Parkir", value: totalWilayah, color: "#3b82f6" },
        { name: "Personel UPTD", value: totalPersonel, color: "#10b981" },
        { name: "Galeri & Berita", value: totalGaleri + totalBerita, color: "#f59e0b" },
    ];

    return (
        <>
            <Head title="Dashboard" />

            {/* Header Dashboard */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Dashboard UPTD Parkir
                </h1>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                    Monitoring Pengelolaan Retribusi & Wilayah Parkir Kabupaten Tasikmalaya
                </p>
            </div>

            {/* Grid 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((item, idx) => (
                    <StatCard key={idx} {...item} />
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Bar Chart - Top Wilayah */}
                <Card className="lg:col-span-2 p-6 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                                    Sebaran Titik Parkir Utama
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Jumlah lokasi parkir per kecamatan
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-72">
                        <ChartBar
                            data={barData}
                            xKey="name"
                            series={[
                                {
                                    key: "doc",
                                    color: "#3b82f6",
                                    name: "Jumlah Lokasi",
                                },
                            ]}
                            height={280}
                        />
                    </div>
                </Card>

                {/* Pie Chart - Komposisi Data */}
                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <PieIcon size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                                Distribusi Konten CMS
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Proporsi data terdaftar
                            </p>
                        </div>
                    </div>
                    <div className="h-72 flex items-center justify-center">
                        <ChartPie data={pieData} />
                    </div>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
