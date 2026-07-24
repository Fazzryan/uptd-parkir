import React, { useMemo } from "react";
import { Link } from "@inertiajs/react";
import SeoHead from "@/Components/SeoHead";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import {
    ChevronRight,
    CreditCard,
    MessageCircle,
    Info,
    Crown,
    UserCheck,
    Users,
} from "lucide-react";
import { StrukturOrganisasiPersonel as PersonelType } from "@/types/model";

interface StrukturOrganisasiProps {
    personel: PersonelType[];
}

const avatarPalette = [
    "bg-blue-700",
    "bg-blue-600",
    "bg-sky-600",
    "bg-indigo-600",
    "bg-cyan-700",
];

function initials(name: string) {
    if (!name) return "U";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

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

function PersonCard({
    person,
    index = 0,
    featured = false,
}: {
    person: PersonelType;
    index?: number;
    featured?: boolean;
}) {
    const photoUrl = getImageUrl(person.foto);

    return (
        <div
            className={`flex flex-col items-center justify-between rounded-3xl border border-slate-100 bg-white p-6 ${
                featured ? "sm:p-8" : "sm:p-6"
            } text-center transition-all hover:border-blue-200 group`}
        >
            <div className="space-y-4 flex flex-col items-center w-full">
                {/* Avatar / Foto */}
                <div className="relative">
                    {photoUrl ? (
                        <img
                            src={photoUrl}
                            alt={person.nama}
                            className={`${
                                featured
                                    ? "h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-blue-50"
                                    : "h-24 w-24 sm:h-28 sm:w-28 border-4 border-slate-50"
                            } rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform duration-300`}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden",
                                );
                            }}
                        />
                    ) : null}
                    <div
                        className={`${photoUrl ? "hidden" : "flex"} ${
                            featured
                                ? "h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-blue-50"
                                : "h-24 w-24 sm:h-28 sm:w-28 border-4 border-slate-50"
                        } ${
                            avatarPalette[index % avatarPalette.length]
                        } items-center justify-center rounded-full text-white shadow-xs group-hover:scale-105 transition-transform duration-300`}
                    >
                        <span
                            className={`${featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"} font-extrabold tracking-wider`}
                        >
                            {initials(person.nama)}
                        </span>
                    </div>
                </div>

                {/* Info Text */}
                <div className="space-y-1.5 w-full">
                    <h3
                        className={`${featured ? "text-lg sm:text-xl font-extrabold" : "text-base sm:text-lg font-bold"} text-slate-900 group-hover:text-blue-700 transition-colors leading-snug`}
                    >
                        {person.nama}
                    </h3>
                    <span
                        className={`inline-block max-w-full truncate rounded-full ${featured ? "bg-blue-600 text-white px-4 py-1 text-xs" : "bg-blue-50 text-blue-700 px-3.5 py-1 text-xs border border-blue-100"} font-bold`}
                    >
                        {person.jabatan || "Petugas UPTD"}
                    </span>
                </div>
            </div>

            {/* NIP Footer */}
            {person.nip ? (
                <div className="mt-4 pt-3 w-full border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
                    <CreditCard className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>NIP. {person.nip}</span>
                </div>
            ) : null}
        </div>
    );
}

export default function StrukturOrganisasi({
    personel = [],
}: StrukturOrganisasiProps) {
    // Memisahkan Kepala, Kasubag, dan Staf / Kolektor
    const { kepala, kasubag, sisaPersonel } = useMemo(() => {
        if (!personel || personel.length === 0) {
            return { kepala: undefined, kasubag: undefined, sisaPersonel: [] };
        }

        let k = personel.find((p) =>
            p.jabatan?.toLowerCase().includes("kepala"),
        );
        let sub = personel.find(
            (p) =>
                p.id !== k?.id &&
                (p.jabatan?.toLowerCase().includes("kasubag") ||
                    p.jabatan?.toLowerCase().includes("sub") ||
                    p.jabatan?.toLowerCase().includes("tata usaha")),
        );

        // Fallback jika nama jabatan tidak mengandung kata kunci spesifik
        if (!k && personel.length > 0) k = personel[0];
        if (!sub && personel.length > 1)
            sub = personel.find((p) => p.id !== k?.id);

        const sisa = personel.filter((p) => p.id !== k?.id && p.id !== sub?.id);

        return { kepala: k, kasubag: sub, sisaPersonel: sisa };
    }, [personel]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            <SeoHead
                title="Struktur Organisasi & Personel - UPTD Parkir Kab. Tasikmalaya"
                description="Profil susunan struktur organisasi dan susunan personel kepemimpinan UPTD Pengelola Parkir Dinas Perhubungan Kabupaten Tasikmalaya."
                keywords="Struktur Organisasi UPTD Parkir, Personel Dishub Tasikmalaya, Kepala UPTD Parkir"
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
                            Struktur Organisasi
                        </span>
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
                            Struktur Organisasi &amp; Personel
                        </h1>
                        <p className="text-base sm:text-lg text-white leading-relaxed">
                            Bagan struktur pimpinan, tata usaha, dan jajaran
                            pelaksana UPTD Pengelola Parkir Kabupaten
                            Tasikmalaya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {personel && personel.length > 0 ? (
                    <>
                        {/* SECTION PIMPINAN & TATA USAHA (DISEJAJARKAN) */}
                        {(kepala || kasubag) && (
                            <section className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
                                    {kepala && (
                                        <PersonCard
                                            person={kepala}
                                            index={0}
                                            featured
                                        />
                                    )}
                                    {kasubag && (
                                        <PersonCard
                                            person={kasubag}
                                            index={1}
                                            featured
                                        />
                                    )}
                                </div>
                            </section>
                        )}

                        {/* LEVEL 3: SISA PERSONEL (KOLEKTOR & STAF) */}
                        {sisaPersonel.length > 0 && (
                            <section className="space-y-6 pt-4">
                                <div className="flex items-center justify-between border-t border-slate-200/80 pt-8">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-700" />
                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                            Kolektor &amp; Staf Pelaksana
                                            Lapangan
                                        </h2>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                                        {sisaPersonel.length} Personel
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {sisaPersonel.map((item, index) => (
                                        <PersonCard
                                            key={item.id || index}
                                            person={item}
                                            index={index + 2}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center px-4">
                        <div className="p-4 rounded-full bg-slate-50 text-slate-400">
                            <Info className="h-8 w-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">
                            Data Personel Belum Tersedia
                        </h3>
                        <p className="max-w-md text-xs sm:text-sm text-slate-500">
                            Data personel struktur organisasi sedang dalam
                            pembaruan berkala.
                        </p>
                    </div>
                )}
            </main>

            {/* ================= FOOTER ================= */}
            <Footer />
        </div>
    );
}
