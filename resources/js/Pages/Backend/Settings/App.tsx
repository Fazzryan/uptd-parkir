import React, { useRef, useState, ChangeEvent, FormEventHandler } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm } from "@inertiajs/react";
import { AppWindow, Upload, Palette } from "lucide-react";
import { AppSettings } from "@/types/model";

interface AppProps {
    settings: AppSettings;
}

export default function App({ settings }: AppProps) {
    const { data, setData, post, processing, errors } = useForm<{
        app_name: string;
        primary_color: string;
        app_logo: File | null;
        wa_number: string;
        wa_message: string;
        teks_hak_pengguna_parkir: string;
    }>({
        app_name: settings.app_name || "UPTD Pengelola Parkir",
        primary_color: settings.primary_color || "#4f46e5",
        app_logo: null,
        wa_number: settings.wa_number || "6281234567890",
        wa_message:
            settings.wa_message ||
            "Halo UPTD Parkir Kab. Tasikmalaya, saya ingin membuat laporan.\n#Nama: \n#Lokasi Kejadian: \n#Jenis Pelanggaran (Tarif Getok/Jukir Liar/Tanpa Karcis): \n#Bukti Foto/Video: ",
        teks_hak_pengguna_parkir:
            settings.teks_hak_pengguna_parkir ||
            "Masyarakat berhak menolak membayar retribusi parkir apabila petugas/juru parkir tidak mengenakan seragam atribut resmi atau tidak menyerahkan karcis resmi bercetak Pemerintah Kabupaten Tasikmalaya.",
    });

    const [previewLogo, setPreviewLogo] = useState<string | null>(
        settings.app_logo ? `/storage/${settings.app_logo}` : null,
    );
    const logoInput = useRef<HTMLInputElement>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("be.settings.app.update"), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("app_logo", file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    return (
        <MainLayout>
            <Head title="Pengaturan Aplikasi" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                    Pengaturan Aplikasi
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Konfigurasi global untuk tampilan dan identitas aplikasi
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <AppWindow
                            className="text-brand-blue-600 dark:text-brand-blue-400"
                            size={20}
                        />
                        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                            Identitas Aplikasi
                        </h2>
                    </div>
                    <Card className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Logo Upload */}
                            {/* <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Logo Aplikasi
                                </label>
                                <div
                                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-brand-blue-200 dark:hover:border-brand-blue-500/50 transition-colors"
                                    onClick={() => logoInput.current?.click()}
                                >
                                    {previewLogo ? (
                                        <div className="mb-4">
                                            <img
                                                src={previewLogo}
                                                alt="App Logo"
                                                className="h-16 object-contain mx-auto"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-brand-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-brand-blue-500 dark:text-brand-blue-400 mb-3 mx-auto">
                                            <Upload size={20} />
                                        </div>
                                    )}
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Klik untuk upload logo baru
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        PNG atau SVG (Transparent Background
                                        recommended)
                                    </p>
                                    <input
                                        type="file"
                                        ref={logoInput}
                                        className="hidden"
                                        accept="image/png,image/svg+xml,image/jpeg"
                                        onChange={handleLogoChange}
                                    />
                                    {errors.app_logo && (
                                        <p className="text-rose-500 text-xs mt-2">
                                            {errors.app_logo}
                                        </p>
                                    )}
                                </div>
                            </div> */}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Nama Aplikasi
                                </label>
                                <TextInput
                                    type="text"
                                    value={data.app_name}
                                    onChange={(e) =>
                                        setData("app_name", e.target.value)
                                    }
                                    className="w-full py-2"
                                    placeholder="Contoh: Dashboard"
                                />
                                {errors.app_name && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.app_name}
                                    </p>
                                )}
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Nama ini akan muncul di tab browser dan
                                    sidebar.
                                </p>
                            </div>

                            {/* Nomor WhatsApp Pengaduan */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Nomor WhatsApp Pengaduan
                                </label>
                                <TextInput
                                    type="text"
                                    value={data.wa_number}
                                    onChange={(e) =>
                                        setData("wa_number", e.target.value)
                                    }
                                    className="w-full py-2"
                                    placeholder="Contoh: 6281234567890"
                                />
                                {errors.wa_number && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.wa_number}
                                    </p>
                                )}
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Format nomor internasional tanpa tanda + (contoh: 6281234567890).
                                </p>
                            </div>

                            {/* Pesan Teks WhatsApp Default */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Pesan Teks WhatsApp Default
                                </label>
                                <textarea
                                    value={data.wa_message}
                                    onChange={(e) =>
                                        setData("wa_message", e.target.value)
                                    }
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-800 dark:text-slate-200 focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 transition-colors"
                                    placeholder="Format draft pesan otomatis pengaduan WhatsApp..."
                                />
                                {errors.wa_message && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.wa_message}
                                    </p>
                                )}
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Draft format pesan awal saat pengunjung mengklik tombol Floating WhatsApp.
                                </p>
                            </div>

                            {/* Teks Imbauan Hak Pengguna Parkir */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Teks Imbauan Hak Pengguna Parkir
                                </label>
                                <textarea
                                    value={data.teks_hak_pengguna_parkir}
                                    onChange={(e) =>
                                        setData(
                                            "teks_hak_pengguna_parkir",
                                            e.target.value
                                        )
                                    }
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-800 dark:text-slate-200 focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 transition-colors"
                                    placeholder="Teks imbauan hak pengguna parkir..."
                                />
                                {errors.teks_hak_pengguna_parkir && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.teks_hak_pengguna_parkir}
                                    </p>
                                )}
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Teks imbauan resmi ini akan ditampilkan pada banner Hak Pengguna Parkir di Beranda &amp; Panduan Jukir.
                                </p>
                            </div>

                            {/* <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Warna Utama (Primary Color)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={data.primary_color}
                                        onChange={(e) =>
                                            setData(
                                                "primary_color",
                                                e.target.value
                                            )
                                        }
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0 p-1 bg-white shadow-sm dark:bg-slate-800"
                                    />
                                    <TextInput
                                        type="text"
                                        value={data.primary_color}
                                        onChange={(e) =>
                                            setData(
                                                "primary_color",
                                                e.target.value
                                            )
                                        }
                                        className="w-32 py-2"
                                        placeholder="#4f46e5"
                                    />
                                    {errors.primary_color && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {errors.primary_color}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Warna dominan untuk tombol, link, dan aksen.
                                </p>
                            </div> */}

                            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                    className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                                >
                                    {/* <Save size={18} /> */}
                                    <span>Simpan Konfigurasi</span>
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Palette
                            className="text-brand-blue-600 dark:text-brand-blue-400"
                            size={20}
                        />
                        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                            Preview Tampilan
                        </h2>
                    </div>
                    {/* Fake Sidebar Preview */}
                    <Card
                        className="p-0 overflow-hidden opacity-90 pointer-events-none select-none"
                        style={
                            {
                                "--primary": data.primary_color,
                            } as React.CSSProperties
                        }
                    >
                        <div className="flex h-64">
                            <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex flex-col">
                                <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
                                    {data.app_name || "..."}
                                </div>
                                <div className="space-y-2">
                                    <div
                                        className="h-8 rounded-lg bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-600 dark:text-brand-blue-400 px-3 flex items-center font-bold text-xs"
                                        style={{
                                            color: data.primary_color,
                                            backgroundColor: `${data.primary_color}1a`,
                                        }}
                                    >
                                        Dashboard
                                    </div>
                                    <div className="h-8 rounded-lg px-3 flex items-center text-slate-400 dark:text-slate-500 text-xs">
                                        Users
                                    </div>
                                    <div className="h-8 rounded-lg px-3 flex items-center text-slate-400 dark:text-slate-500 text-xs">
                                        Settings
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6">
                                <div className="h-8 mb-4 flex justify-between">
                                    <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border-t-4 border-brand-blue-500"
                                        style={{
                                            borderColor: data.primary_color,
                                        }}
                                    ></div>
                                    <div className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                        Preview ilustrasi sidebar dengan warna terpilih
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
