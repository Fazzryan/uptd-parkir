import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    ChevronRight,
    ScrollText,
    ShieldCheck,
    Bike,
    Car,
    Truck,
    MessageCircle,
    Info,
    Receipt,
} from "lucide-react";
import { TarifParkirKarcis as TarifParkirKarcisType } from "@/types/model";

interface TarifKarcisProps {
    tarifParkir: TarifParkirKarcisType[];
}

const ciriKeamanan = [
    "Logo resmi Pemerintah Kabupaten Tasikmalaya tercetak jelas",
    "Nomor seri unik pada setiap lembar karcis",
    "Mencantumkan nominal tarif resmi sesuai Perda",
    "Dicetak pada kertas thermal / karbon resmi UPTD, bukan kertas biasa",
];

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

export default function TarifKarcis({ tarifParkir = [] }: TarifKarcisProps) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <Head title="Tarif Resmi & Karcis - UPTD Parkir Kab. Tasikmalaya" />

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
                            Tarif &amp; Karcis Resmi
                        </span>
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
                            Tarif Resmi &amp; Karcis Parkir
                        </h1>
                        <p className="text-base sm:text-lg text-white leading-relaxed">
                            Informasi besaran tarif retribusi parkir resmi dan
                            tampilan sampel karcis sah sesuai Peraturan Daerah
                            Kabupaten Tasikmalaya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* TABEL TARIF & KAMPEL KARCIS */}
                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                Regulasi &amp; Sampel Resmi
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                                Daftar Tarif &amp; Sampel Karcis
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Daftar besaran tarif retribusi pelayanan parkir
                                di tepi jalan umum beserta sampel karcis resmi
                                Kabupaten Tasikmalaya .
                            </p>
                        </div>
                    </div>

                    {/* Mobile View: 2-Column Grid Cards */}
                    <div className="grid grid-cols-2 gap-4 md:hidden">
                        {tarifParkir && tarifParkir.length > 0 ? (
                            tarifParkir.map((t) => {
                                const imageUrl = getImageUrl(t.foto);
                                return (
                                    <div
                                        key={t.id}
                                        className="flex flex-col justify-between p-4 rounded-3xl bg-white border border-slate-100 space-y-3"
                                    >
                                        {/* Foto Sampel Karcis (Aspect 3/2) */}
                                        <div className="w-full aspect-[3/2] shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={`Karcis ${t.kategori_kendaraan}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                        e.currentTarget.nextElementSibling?.classList.remove(
                                                            "hidden",
                                                        );
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className={`${
                                                    imageUrl ? "hidden" : "flex"
                                                } absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center`}
                                            >
                                                <Receipt className="h-6 w-6 mb-1 text-slate-400" />
                                                <span className="text-[10px] font-medium">
                                                    Tanpa Foto
                                                </span>
                                            </div>
                                        </div>

                                        {/* Informasional */}
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-slate-900 text-sm leading-snug">
                                                {t.kategori_kendaraan}
                                            </h3>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100">
                                            <span className="text-base font-extrabold text-blue-900 block">
                                                Rp{" "}
                                                {Number(
                                                    t.nominal_tarif,
                                                ).toLocaleString("id-ID")}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-normal">
                                                {t.keterangan ||
                                                    "Sekali parkir di lokasi resmi"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
                                <Info className="h-6 w-6 mx-auto text-slate-400 mb-1" />
                                <p className="text-xs font-medium">
                                    Data tarif parkir belum tersedia.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-gradient-to-br from-blue-900 to-slate-900 text-white text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-4 font-bold">
                                            Sampel Karcis
                                        </th>
                                        <th className="px-6 py-4 font-bold">
                                            Kategori Kendaraan
                                        </th>
                                        <th className="px-6 py-4 font-bold">
                                            Keterangan
                                        </th>
                                        <th className="px-6 py-4 text-right font-bold">
                                            Tarif Resmi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tarifParkir && tarifParkir.length > 0 ? (
                                        tarifParkir.map((t) => {
                                            const imageUrl = getImageUrl(
                                                t.foto,
                                            );

                                            return (
                                                <tr
                                                    key={t.id}
                                                    className="hover:bg-slate-50/50 transition-colors"
                                                >
                                                    {/* Kolom Sampel Karcis */}
                                                    <td className="px-6 py-4">
                                                        {imageUrl ? (
                                                            <div className="w-24 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 relative group">
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={`Karcis ${t.kategori_kendaraan}`}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    onError={(
                                                                        e,
                                                                    ) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                        e.currentTarget.nextElementSibling?.classList.remove(
                                                                            "hidden",
                                                                        );
                                                                    }}
                                                                />
                                                                <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-1 text-center">
                                                                    <Receipt className="h-5 w-5 mb-0.5 text-slate-400" />
                                                                    <span className="text-[9px]">
                                                                        Tanpa
                                                                        Foto
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-24 h-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-400 p-1">
                                                                <Receipt className="h-5 w-5 mb-0.5" />
                                                                <span className="text-[10px] font-medium text-slate-400">
                                                                    Tanpa Foto
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Kolom Kategori Kendaraan */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3.5">
                                                            <span className="font-bold text-slate-900 text-sm">
                                                                {
                                                                    t.kategori_kendaraan
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Kolom Keterangan */}
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {t.keterangan ||
                                                            "Sekali parkir di lokasi resmi"}
                                                    </td>

                                                    {/* Kolom Tarif Resmi */}
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-xl font-extrabold text-blue-900">
                                                            Rp{" "}
                                                            {Number(
                                                                t.nominal_tarif,
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-8 text-center text-slate-500"
                                            >
                                                <Info className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                                Data tarif parkir belum
                                                tersedia.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>

            {/* ================= FOOTER ================= */}
            <Footer />
        </div>
    );
}
