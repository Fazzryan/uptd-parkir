import React, { useState } from "react";
import { AlertTriangle, X, ChevronUp, ChevronDown, Info } from "lucide-react";

/**
 * Interface Props untuk komponen SimulasiNotice
 */
interface SimulasiNoticeProps {
    title?: string;
    description?: string;
    badgeText?: string;
    className?: string;
    defaultExpanded?: boolean;
}

/**
 * Komponen SimulasiNotice
 *
 * Menampilkan floating toastr/notifikasi fixed di sudut kiri atas layar
 * yang memberitahukan kepada pengguna/peninjau bahwa modul bersangkutan
 * saat ini masih dalam tahap simulasi / prototype dan belum beroperasi riil.
 *
 * Fitur:
 * - Posisi fixed di sudut kiri atas (responsif terhadap mobile & desktop sidebar).
 * - Dilengkapi animasi pulse live status.
 * - Tombol minimize / expand agar pengguna dapat mengecilkan notifikasi menjadi pill badge.
 * - Tombol tutup sementara (dismiss) dengan fallback chip untuk membuka kembali.
 * - Mendukung tema terang (Light Mode) dan tema gelap (Dark Mode).
 */
export default function SimulasiNotice({
    title = "Fitur Masih Tahap Simulasi",
    description = "Modul Setoran Harian ini saat ini belum berfungsi secara riil dan masih dalam tahap simulasi/uji coba. Seluruh data transaksi yang dicatat belum terhubung ke sistem kas daerah.",
    badgeText = "Mode Simulasi",
    className = "",
    defaultExpanded = true,
}: SimulasiNoticeProps) {
    // State untuk kontrol tampilan: diperluas (expanded) atau diperkecil (minimized)
    const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
    // State untuk kontrol apakah notifikasi ditutup sepenuhnya (dismissed)
    const [isVisible, setIsVisible] = useState<boolean>(true);

    // Jika ditutup sepenuhnya, sediakan chip kecil di posisi yang sama agar bisa dibuka kembali jika diperlukan
    if (!isVisible) {
        return (
            <aside
                aria-label="Notifikasi Simulasi"
                className={`fixed top-20 md:top-6 left-4 md:left-[19.5rem] z-40 animate-in fade-in duration-200 ${className}`}
            >
                <button
                    type="button"
                    onClick={() => {
                        setIsVisible(true);
                        setIsExpanded(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs font-semibold shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                    title="Buka notifikasi status simulasi"
                >
                    <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-[11px]">Mode Simulasi</span>
                </button>
            </aside>
        );
    }

    // Tampilan ketika notifikasi diminimize (Mode Pill Ringkas)
    if (!isExpanded) {
        return (
            <aside
                aria-label="Notifikasi Simulasi"
                className={`fixed top-20 md:top-6 left-4 md:left-[19.5rem] z-40 animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
            >
                <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/95 hover:bg-amber-100/95 dark:bg-slate-900/95 dark:hover:bg-slate-800/95 border-2 border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-500/10 text-amber-900 dark:text-amber-200 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                    title="Klik untuk melihat penjelasan fitur simulasi"
                >
                    {/* Animasi Denyut Lampu Indikator */}
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>

                    <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
                    <span>{badgeText}</span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-normal">
                        (Klik untuk detail)
                    </span>
                    <ChevronDown
                        size={14}
                        className="opacity-70 group-hover:opacity-100 transition-opacity ml-0.5"
                    />
                </button>
            </aside>
        );
    }

    // Tampilan Penuh Toastr Card (Default)
    return (
        <aside
            aria-label="Pemberitahuan Fitur Simulasi"
            className={`fixed top-20 md:top-6 left-4 md:left-[19.5rem] z-40 w-[calc(100vw-2rem)] sm:w-96 animate-in fade-in slide-in-from-top-3 duration-300 ${className}`}
        >
            <div className="rounded-2xl border-2 border-amber-400/90 dark:border-amber-500/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl shadow-amber-500/10 transition-all">
                {/* Header Toastr */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                                    {badgeText}
                                </h2>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                {title}
                            </h3>
                        </div>
                    </div>

                    {/* Tombol Aksi: Minimize & Close */}
                    <div className="flex items-center gap-1 shrink-0 -mt-0.5 -mr-0.5">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Kecilkan pemberitahuan"
                            aria-label="Kecilkan"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsVisible(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Tutup pemberitahuan"
                            aria-label="Tutup"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Body Keterangan Notifikasi */}
                <div className="pl-10 pr-1">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {description}
                    </p>

                    {/* Footer Catatan Kecil */}
                    <div className="mt-2.5 pt-2 border-t border-amber-100 dark:border-amber-900/60 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="font-semibold hover:text-amber-900 dark:hover:text-amber-200 cursor-pointer"
                        >
                            Sembunyikan
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
