import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Menu,
    X,
    MapPin,
    Receipt,
    BookOpen,
    Network,
    Camera,
    Phone,
    LogIn,
    LayoutDashboard,
    Landmark,
} from "lucide-react";

export default function Navbar() {
    const { auth } = usePage().props as any;
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        // { label: "Beranda", href: route("fe.beranda") },
        { label: "Wilayah Parkir", href: "/wilayah-parkir", icon: MapPin },
        { label: "Tarif & Karcis", href: "/tarif-parkir", icon: Receipt },
        { label: "Panduan Jukir", href: "/panduan-jukir", icon: BookOpen },
        {
            label: "Struktur Organisasi",
            href: "/struktur-organisasi",
            icon: Network,
        },
        { label: "Galeri & Berita", href: "/dokumentasi", icon: Camera },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-blue-900/10 bg-blue-900/95 backdrop-blur supports-[backdrop-filter]:bg-blue-900/90 text-white shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
                    {/* Logo & Branding */}
                    <Link
                        href={route("fe.beranda")}
                        className="flex items-center gap-3"
                    >
                        <img
                            src="/assets/logo/logotasik.png"
                            alt="Logo Kab. Tasikmalaya"
                            className="h-10 w-auto object-contain drop-shadow"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden",
                                );
                            }}
                        />
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                            <Landmark className="h-5 w-5 text-white" />
                        </div>

                        <div className="leading-tight">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-white">
                                Pemerintah Kab. Tasikmalaya
                            </p>
                            <p className="text-sm font-semibold text-white sm:text-base tracking-tight">
                                UPTD Pengelola Parkir Dishubkominfo
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden items-center gap-6 lg:flex">
                        {navLinks.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-blue-50 transition hover:text-white"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right Action Button (Login / Dashboard) */}
                    <div className="hidden lg:flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route("be.dashboard")}
                                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 rounded-full transition duration-200 shadow-md"
                            >
                                <span>Dashboard Admin</span>
                            </Link>
                        ) : (
                            <Link
                                href={route("login")}
                                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-blue-700 hover:bg-blue-600 border border-blue-500 rounded-full transition-all duration-200 shadow-md active:scale-95"
                            >
                                <span>Masuk</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg p-2 text-white hover:bg-blue-800 transition lg:hidden"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Side Drawer */}
                    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col justify-between">
                        <div>
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 bg-blue-900 text-white">
                                <div className="leading-tight">
                                    <p className="text-[10px] text-blue-200 uppercase font-semibold">
                                        Navigasi
                                    </p>
                                    <p className="font-bold text-sm">
                                        UPTD Parkir
                                    </p>
                                </div>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    aria-label="Tutup menu"
                                    className="p-1 rounded-lg hover:bg-blue-800 text-white transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Drawer Nav Links */}
                            <nav className="flex flex-col gap-1 p-3">
                                {navLinks.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                        >
                                            {IconComponent && (
                                                <IconComponent className="h-4 w-4 text-blue-700 shrink-0" />
                                            )}
                                            <span>{item.label}</span>
                                        </a>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Bottom Action */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            {auth?.user ? (
                                <Link
                                    href={route("be.dashboard")}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-blue-900 bg-brand-yellow-400 rounded-xl shadow active:scale-95"
                                >
                                    <LayoutDashboard size={16} />
                                    <span>Dashboard Admin</span>
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-blue-700 rounded-xl shadow active:scale-95"
                                >
                                    <LogIn size={16} />
                                    <span>Masuk Sistem</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
