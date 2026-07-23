// resources/js/Components/Sidebar.tsx
import React, {
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
} from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    CircleCheck,
    FileCheck,
    FileText,
    CircleGauge,
    Moon,
    Sun,
    User,
    Home,
    MapPin,
    Network,
    BookOpen,
    Receipt,
    Image as ImageIcon,
    Newspaper,
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface AppSettings {
    app_name?: string;
    app_logo?: string;
    [key: string]: unknown;
}

interface SharedProps {
    app_settings?: AppSettings;
    [key: string]: unknown;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        // Dropdown otomatis terbuka jika route saat ini adalah bagian dari be.users.*
        userManagement:
            route().current("be.users.*") || route().current("be.roles.*"),
        settingManagement: route().current("be.settings.*"),
    });

    const toggleMenu = (menuName: string) => {
        setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    // Get App Settings and Auth from Inertia Shared Props
    const { app_settings, auth } = usePage<SharedProps>().props as any;
    const user = auth?.user;
    const roles = auth?.roles || [];
    const permissions = auth?.permissions || [];
    const appName = app_settings?.app_name || "DASHBOARD UPTD";

    // User Menu & Dark Mode Logic
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initialize theme
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (
            storedTheme === "dark" ||
            (!storedTheme &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <aside
            className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60
            transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            flex flex-col h-screen
        `}
        >
            {/* Logo & Close Button */}
            <div className="p-6 md:p-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <span className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 tracking-wider leading-tight line-clamp-2">
                        {appName}
                    </span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-2 text-slate-400 dark:text-slate-500"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Menu Navigasi - Scrollable Area */}
            <nav className="flex-1 px-4 overflow-y-auto space-y-1 custom-scrollbar pb-6">
                <p className="px-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Main Menu
                </p>

                {/* Dashboard */}
                <Link
                    href={route("be.dashboard")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group 
                        ${
                            route().current("be.dashboard")
                                ? "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                >
                    <LayoutDashboard
                        size={20}
                        strokeWidth={2}
                        className={`${
                            route().current("be.dashboard")
                                ? "text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                        }`}
                    />
                    Dashboard
                </Link>

                <p className="px-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-4">
                    Master Data
                </p>

                {permissions.includes("view-struktur-organisasi") && (
                    <Link
                        href={route("be.struktur-organisasi.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group 
                        ${
                            route().current("be.struktur-organisasi.*")
                                ? "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Network
                            size={20}
                            strokeWidth={2}
                            className={`${
                                route().current("be.struktur-organisasi.*")
                                    ? "text-brand-blue-600 dark:text-brand-blue-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                            }`}
                        />
                        Struktur Organisasi
                    </Link>
                )}

                {permissions.includes("view-tarif-parkir") && (
                    <Link
                        href={route("be.tarif-parkir.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group 
                        ${
                            route().current("be.tarif-parkir.*")
                                ? "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Receipt
                            size={20}
                            strokeWidth={2}
                            className={`${
                                route().current("be.tarif-parkir.*")
                                    ? "text-brand-blue-600 dark:text-brand-blue-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                            }`}
                        />
                        Tarif Parkir & Karcis
                    </Link>
                )}

                {permissions.includes("view-wilayah-parkir") && (
                    <Link
                        href={route("be.wilayah-parkir.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group 
                        ${
                            route().current("be.wilayah-parkir.*")
                                ? "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <MapPin
                            size={20}
                            strokeWidth={2}
                            className={`${
                                route().current("be.wilayah-parkir.*")
                                    ? "text-brand-blue-600 dark:text-brand-blue-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                            }`}
                        />
                        Wilayah Parkir
                    </Link>
                )}

                {permissions.includes("view-panduan-jukir") && (
                    <Link
                        href={route("be.panduan-jukir.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group 
                        ${
                            route().current("be.panduan-jukir.*")
                                ? "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <BookOpen
                            size={20}
                            strokeWidth={2}
                            className={`${
                                route().current("be.panduan-jukir.*")
                                    ? "text-brand-blue-600 dark:text-brand-blue-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                            }`}
                        />
                        Panduan Jukir
                    </Link>
                )}

                {(permissions.length === 0 ||
                    permissions.includes("view-galeri-foto") ||
                    permissions.includes("view-berita")) && (
                    <p className="px-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-4">
                        Informasi & Publikasi
                    </p>
                )}

                {(permissions.length === 0 ||
                    permissions.includes("view-galeri-foto")) && (
                    <Link
                        href={route("be.galeri-foto.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group 
                        ${
                            route().current("be.galeri-foto.*")
                                ? "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <ImageIcon
                            size={20}
                            strokeWidth={2}
                            className={`${
                                route().current("be.galeri-foto.*")
                                    ? "text-brand-blue-600 dark:text-brand-blue-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                            }`}
                        />
                        Galeri Foto
                    </Link>
                )}

                {(permissions.length === 0 ||
                    permissions.includes("view-berita")) && (
                    <Link
                        href={route("be.berita.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group 
                        ${
                            route().current("be.berita.*")
                                ? "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Newspaper
                            size={20}
                            strokeWidth={2}
                            className={`${
                                route().current("be.berita.*")
                                    ? "text-brand-blue-600 dark:text-brand-blue-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                            }`}
                        />
                        Berita & Pengumuman
                    </Link>
                )}

                {/* User Management Dropdown */}

                {/* Sistem & Pengaturan Menu */}
                <p className="px-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-4">
                    Sistem
                </p>

                {roles.includes("admin") && permissions.includes("view-users") && (
                    <div>
                        <button
                            onClick={() => toggleMenu("userManagement")}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group
                    ${
                        route().current("be.users.*")
                            ? "text-brand-blue-600 dark:text-brand-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                        >
                            <div className="flex items-center gap-3">
                                <Users
                                    size={20}
                                    strokeWidth={2}
                                    className={`${
                                        route().current("be.users.*")
                                            ? "text-brand-blue-600 dark:text-brand-blue-400"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                                    }`}
                                />
                                User Management
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                    openMenus.userManagement
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                openMenus.userManagement
                                    ? "max-h-40"
                                    : "max-h-0"
                            }`}
                        >
                            <div className="ml-9 border-slate-100 dark:border-slate-800 mt-1 space-y-1">
                                <Link
                                    href={route("be.users.index")}
                                    className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                        route().current("be.users.*")
                                            ? "text-brand-blue-600 dark:text-brand-blue-400 font-semibold bg-brand-blue-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-brand-blue-600 dark:hover:text-brand-blue-400"
                                    }`}
                                >
                                    User
                                </Link>
                                {permissions.includes(
                                    "manage-roles",
                                ) && (
                                    <Link
                                        href={route("be.roles.index")}
                                        className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                            route().current(
                                                "be.roles.*",
                                            )
                                                ? "text-brand-blue-600 dark:text-brand-blue-400 font-semibold bg-brand-blue-50/50 dark:bg-slate-800/50"
                                                : "text-slate-500 dark:text-slate-400 hover:text-brand-blue-600 dark:hover:text-brand-blue-400"
                                        }`}
                                    >
                                        Role
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <button
                        onClick={() => toggleMenu("settingManagement")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group
                        ${
                            route().current("be.settings.*")
                                ? "text-brand-blue-600 dark:text-brand-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Settings
                                size={20}
                                strokeWidth={2}
                                className={`${
                                    route().current("be.settings.*")
                                        ? "text-brand-blue-600 dark:text-brand-blue-400"
                                        : "text-slate-400 dark:text-slate-500 group-hover:text-brand-blue-500"
                                }`}
                            />
                            Pengaturan
                        </div>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${
                                openMenus.settingManagement
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openMenus.settingManagement
                                ? "max-h-40"
                                : "max-h-0"
                        }`}
                    >
                        <div className="ml-9 border-slate-100 dark:border-slate-800 mt-1 space-y-1">
                            <Link
                                href={route("be.settings.profile")}
                                className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                    route().current(
                                        "be.settings.profile",
                                    )
                                        ? "text-brand-blue-600 dark:text-brand-blue-400 font-semibold bg-brand-blue-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-brand-blue-600 dark:hover:text-brand-blue-400"
                                }`}
                            >
                                Profil Saya
                            </Link>
                            <Link
                                href={route("be.settings.app")}
                                className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                    route().current("be.settings.app")
                                        ? "text-brand-blue-600 dark:text-brand-blue-400 font-semibold bg-brand-blue-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-brand-blue-600 dark:hover:text-brand-blue-400"
                                }`}
                            >
                                Aplikasi
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div ref={dropdownRef} className="relative">
                    {/* Trigger Button */}
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                            <div className="w-9 h-9 shrink-0 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-blue-600 dark:text-brand-blue-400 font-bold overflow-hidden shadow-sm">
                                {user?.profile_photo_path ? (
                                    <img
                                        src={`/storage/${user.profile_photo_path}`}
                                        alt={user?.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : user?.name ? (
                                    user.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase()
                                ) : (
                                    "U"
                                )}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                    {roles[0] || "User"}
                                </p>
                            </div>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`shrink-0 text-slate-400 transition-transform duration-200 ml-2 ${
                                isDropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Pop-up Menu (Membuka ke Atas) */}
                    {/* Gunakan bottom-full dan mb-2 agar muncul di atas footer */}
                    <div
                        className={`absolute bottom-full left-0 right-0 mb-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 transform transition-all duration-200 origin-bottom ${
                            isDropdownOpen
                                ? "opacity-100 scale-100 translate-y-0"
                                : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                        }`}
                    >
                        <div className="p-1 space-y-1">
                            {/* Dark Mode Toggle Item */}
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                                <span className="flex items-center gap-2.5">
                                    {isDarkMode ? (
                                        <Sun size={16} />
                                    ) : (
                                        <Moon size={16} />
                                    )}
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>

                            <Link
                                href={route("fe.beranda")}
                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                                <Home size={16} />
                                Halaman Depan
                            </Link>

                            {permissions.includes("settings.profile") && (
                                <Link
                                    href={route("be.settings.profile")}
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <User size={16} />
                                    Profil Saya
                                </Link>
                            )}
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
                            >
                                <LogOut size={16} />
                                Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
