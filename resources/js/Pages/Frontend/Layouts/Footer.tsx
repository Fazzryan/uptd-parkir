import React from "react";
import { usePage } from "@inertiajs/react";
import FloatingWhatsapp from "./FloatingWhatsapp";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

interface VisitorStats {
    today?: number;
    thisWeek?: number;
    thisMonth?: number;
    total?: number;
}

interface FooterProps {
    stats?: VisitorStats;
}

export default function Footer({ stats }: FooterProps) {
    const sharedVisitorStats = usePage<any>().props.visitor_stats;

    // Ambil data statistik dari database via shared props
    const visitorData = {
        today: stats?.today ?? sharedVisitorStats?.today ?? 0,
        thisWeek: stats?.thisWeek ?? sharedVisitorStats?.thisWeek ?? 0,
        thisMonth: stats?.thisMonth ?? sharedVisitorStats?.thisMonth ?? 0,
        total: stats?.total ?? sharedVisitorStats?.total ?? 0,
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("id-ID").format(num);
    };

    return (
        <footer className="bg-slate-900 text-white border-t border-slate-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Branding & Profile */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo Pemkab Tasikmalaya"
                                className="h-12 w-auto object-contain drop-shadow"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                            <div>
                                <h3 className="font-extrabold text-base tracking-wide text-white">
                                    UPTD PENGELOLA PARKIR
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">
                                    Dishubkominfo Kab. Tasikmalaya
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Penyelenggara retribusi dan pelayanan parkir tepi
                            jalan umum yang tertib, transparan, dan profesional
                            di Kabupaten Tasikmalaya.
                        </p>
                    </div>

                    {/* Column 2: Kontak Resmi */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                            Kontak Resmi
                        </h4>
                        <div className="space-y-3 text-xs text-slate-300">
                            <div className="flex items-start gap-2.5">
                                <MapPin
                                    size={16}
                                    className="text-white shrink-0 mt-0.5"
                                />
                                <span>
                                    Cintaraja, Kec. Singaparna, Kabupaten
                                    Tasikmalaya, Jawa Barat 46182
                                </span>
                            </div>
                            {/* <div className="flex items-center gap-2.5">
                                <Phone
                                    size={16}
                                    className="text-white shrink-0"
                                />
                                <span>(0265) 543210 / 0812-3456-7890</span>
                            </div> */}
                            <div className="flex items-center gap-2.5">
                                <Mail
                                    size={16}
                                    className="text-white shrink-0"
                                />
                                <span>uptdparkir@tasikmalayakab.go.id</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Statistik Kunjungan Website (Visitor Counter) */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                            Statistik Kunjungan
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <span className="block text-[11px] text-slate-400 font-medium mb-1">
                                    Hari Ini
                                </span>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.today)}
                                </p>
                            </div>

                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <span className="block text-[11px] text-slate-400 font-medium mb-1">
                                    Minggu Ini
                                </span>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.thisWeek)}
                                </p>
                            </div>

                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <span className="block text-[11px] text-slate-400 font-medium mb-1">
                                    Bulan Ini
                                </span>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.thisMonth)}
                                </p>
                            </div>

                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <span className="block text-[11px] text-slate-400 font-medium mb-1">
                                    Total Hits
                                </span>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.total)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Lokasi Peta / Google Maps Embed */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                            Peta Lokasi Kantor
                        </h4>
                        <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-800 h-32 relative group">
                            <iframe
                                title="Peta Kantor UPTD Parkir"
                                src="https://maps.google.com/maps?q=Singaparna,Tasikmalaya&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                className="w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity"
                                loading="lazy"
                            ></iframe>
                            <a
                                href="https://maps.google.com/?q=Singaparna,Tasikmalaya"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-colors shadow"
                            >
                                <span>Buka Maps</span>
                                <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>
                        &copy; {new Date().getFullYear()} UPTD Pengelola Parkir
                        · Dinas Perhubungan Komunikasi dan Informatika Kabupaten
                        Tasikmalaya
                    </p>
                    <p className="text-[11px] text-slate-500">
                        Pemerintah Kabupaten Tasikmalaya
                    </p>
                </div>
            </div>
            <FloatingWhatsapp />
        </footer>
    );
}
