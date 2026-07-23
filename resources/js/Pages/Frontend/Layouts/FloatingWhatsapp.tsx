import React from "react";
import { MessageCircle } from "lucide-react";
import { usePage } from "@inertiajs/react";

interface FloatingWhatsappProps {
    phoneNumber?: string;
    message?: string;
}

export default function FloatingWhatsapp({
    phoneNumber,
    message,
}: FloatingWhatsappProps) {
    const appSettings = usePage<any>().props.app_settings || {};

    const targetPhone =
        phoneNumber || appSettings.wa_number || "6281234567890";

    const defaultMsg =
        message ||
        appSettings.wa_message ||
        "Halo UPTD Parkir Kab. Tasikmalaya, saya ingin membuat laporan.\n#Nama: \n#Lokasi Kejadian: \n#Jenis Pelanggaran (Tarif Getok/Jukir Liar/Tanpa Karcis): \n#Bukti Foto/Video: ";

    const encodedMessage = encodeURIComponent(defaultMsg);

    return (
        <a
            href={`https://wa.me/${targetPhone}?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 px-4.5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/40 active:scale-95"
            title="Laporkan Jukir Liar via WhatsApp"
        >
            {/* Soft ambient pulse glow ring instead of giant ping overlay */}
            <span className="absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-r from-red-600 to-amber-500 opacity-40 blur-sm transition-all duration-300 group-hover:opacity-75 animate-pulse" />

            {/* Icon with mini online badge dot */}
            <div className="relative flex items-center justify-center">
                <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                </span>
            </div>

            <span className="hidden sm:inline font-bold tracking-wide">Laporkan Jukir Liar</span>
            <span className="sm:hidden font-bold">Lapor WA</span>
        </a>
    );
}
