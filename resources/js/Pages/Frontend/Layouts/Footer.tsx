import React from "react";
import { MapPin, Phone, Mail, Eye, Calendar, Users, Globe, ExternalLink } from "lucide-react";

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
    // Default Visitor Counter (dapat disuplai dari props controller / state)
    const visitorData = {
        today: stats?.today ?? 142,
        thisWeek: stats?.thisWeek ?? 1250,
        thisMonth: stats?.thisMonth ?? 4890,
        total: stats?.total ?? 18450,
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
                            Penyelenggara retribusi dan pelayanan parkir tepi jalan umum
                            yang tertib, transparan, dan profesional di Kabupaten Tasikmalaya.
                        </p>
                    </div>

                    {/* Column 2: Kontak Resmi */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
                            Kontak Resmi
                        </h4>
                        <div className="space-y-3 text-xs text-slate-300">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                <span>
                                    Jl. Raya Singaparna, Komplek Perkantoran Pemkab Tasikmalaya, Jawa Barat
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone size={16} className="text-blue-400 shrink-0" />
                                <span>(0265) 543210 / 0812-3456-7890</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail size={16} className="text-blue-400 shrink-0" />
                                <span>uptdparkir@tasikmalayakab.go.id</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Statistik Kunjungan Website (Visitor Counter) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Eye size={16} className="text-blue-400" />
                            <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400">
                                Statistik Kunjungan
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                                    <Calendar size={12} className="text-emerald-400" />
                                    <span>Hari Ini</span>
                                </div>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.today)}
                                </p>
                            </div>

                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                                    <Users size={12} className="text-blue-400" />
                                    <span>Minggu Ini</span>
                                </div>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.thisWeek)}
                                </p>
                            </div>

                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                                    <Calendar size={12} className="text-amber-400" />
                                    <span>Bulan Ini</span>
                                </div>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.thisMonth)}
                                </p>
                            </div>

                            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                                    <Globe size={12} className="text-purple-400" />
                                    <span>Total Hits</span>
                                </div>
                                <p className="text-sm font-extrabold text-white">
                                    {formatNumber(visitorData.total)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Lokasi Peta / Google Maps Embed */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
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
                        &copy; {new Date().getFullYear()} UPTD Pengelola Parkir · Dinas Perhubungan Komunikasi dan Informatika Kabupaten Tasikmalaya
                    </p>
                    <p className="text-[11px] text-slate-500">
                        Pemerintah Kabupaten Tasikmalaya
                    </p>
                </div>
            </div>
        </footer>
    );
}
