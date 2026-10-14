import React, { FormEventHandler, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import TextArea from "@/Components/Form/TextArea";
import SelectInput from "@/Components/Form/SelectInput";
import SelectSearch from "@/Components/Form/SelectSearch";
import FileUpload from "@/Components/Form/FileUpload";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Image as ImageIcon,
    User as UserIcon,
    ShieldCheck,
    MapPin,
    X,
} from "lucide-react";
import { User, WilayahParkir } from "@/types/model";

interface CreateProps {
    users: User[];
    wilayahParkir: WilayahParkir[];
}

export default function Create({ users = [], wilayahParkir = [] }: CreateProps) {    
    const { data, setData, post, processing, errors } = useForm<{
        user_id: string | number;
        nama: string;
        nohp: string;
        alamat: string;
        status: "Aktif" | "Tidak Aktif";
        foto: File | null;
        wilayah_parkir_id: string | number;
        username: string;
        email: string;
        password: string;
    }>({
        // tabel jukir
        user_id: "",
        nama: "",
        nohp: "",
        alamat: "",
        status: "Aktif",
        foto: null,
        wilayah_parkir_id: "",

        // tabel user
        username: "",
        email: "",
        password: "",
    });

    // Opsi titik wilayah parkir untuk dropdown
    const wilayahOptions = wilayahParkir.map((w) => ({
        label: `${w.nama_jalan}${w.kecamatan?.nama_kecamatan ? ` - Kec. ${w.kecamatan.nama_kecamatan}` : ""}`,
        value: w.id.toString(),
    }));

    // Data titik wilayah parkir yang sedang terpilih
    const selectedWilayah = wilayahParkir.find(
        (w) => String(w.id) === String(data.wilayah_parkir_id)
    );

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (file: File | null) => {
        setData("foto", file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleRemoveFile = () => {
        setData("foto", null);
        setPreviewUrl(null);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("be.data-jukir.store"), {
            forceFormData: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Tambah Juru Parkir" />

            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={route("be.data-jukir.index")}
                    className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-brand-blue-600 hover:border-brand-blue-100 transition-all shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-blue-400"
                    title="Kembali ke Daftar Jukir"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        Tambah Juru Parkir Baru
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Silakan lengkapi formulir di bawah untuk mendaftarkan data
                        juru parkir
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Kolom Kiri: Form Input Data Jukir */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                Data Juru Parkir
                            </h3>
                        </div>
                        <div className="p-5 sm:p-6 space-y-3">
                            {/* Nama Lengkap & Nomor HP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextInput
                                    label="Nama Lengkap*"
                                    placeholder="John Doe"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    className="w-full font-medium"
                                    error={errors.nama}
                                />

                                <TextInput
                                    label="Nomor HP*"
                                    type="tel"
                                    placeholder="081234567890"
                                    value={data.nohp}
                                    onChange={(e) =>
                                        setData("nohp", e.target.value)
                                    }
                                    className="w-full font-medium"
                                    error={errors.nohp}
                                />
                            </div>

                            {/* Status Keaktifan */}
                            <div className="space-y-1.5">
                                <SelectInput
                                    label="Status Keaktifan*"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            "status",
                                            e.target.value as
                                                | "Aktif"
                                                | "Tidak Aktif",
                                        )
                                    }
                                    error={errors.status}
                                    className="w-full"
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Tidak Aktif">
                                        Tidak Aktif
                                    </option>
                                </SelectInput>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Tentukan apakah juru parkir berstatus aktif
                                    bertugas atau dinonaktifkan.
                                </p>
                            </div>

                            {/* Alamat Lengkap */}
                            <TextArea
                                label="Alamat Tempat Tinggal*"
                                placeholder="Masukkan alamat domisili atau tempat tinggal juru parkir..."
                                rows={3}
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                className="w-full"
                                error={errors.alamat}
                            />

                            {/* Upload Foto Jukir */}
                            <FileUpload
                                label="Foto Juru Parkir"
                                required
                                error={errors.foto}
                                previewUrl={previewUrl}
                                onChange={handleFileChange}
                                onRemove={handleRemoveFile}
                                title="Klik atau seret untuk mengunggah foto jukir"
                                subtitle="PNG, JPG, JPEG, atau WEBP (Maksimal 1MB)"
                            />
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 sm:p-8 bg-slate-50/40 border-t border-slate-100 flex items-center justify-end gap-3 dark:bg-slate-800/40 dark:border-slate-700">
                            <Button
                                variant="secondary"
                                href={route("be.data-jukir.index")}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                                className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                            >
                                <span>
                                    {processing ? "Menyimpan..." : "Simpan Data"}
                                </span>
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Kolom Kanan: Panduan Registrasi */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="!overflow-visible relative z-20">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                Titik Wilayah Penugasan
                            </h3>
                        </div>
                        <div className="p-5 sm:p-6 space-y-4">
                            <SelectSearch
                                label="Pilih Titik Lokasi Parkir*"
                                placeholder="Cari nama jalan atau kecamatan..."
                                options={wilayahOptions}
                                value={data.wilayah_parkir_id ? String(data.wilayah_parkir_id) : ""}
                                onChange={(val) => setData("wilayah_parkir_id", val)}
                                error={errors.wilayah_parkir_id}
                            />

                            {/* Preview Titik Wilayah Terpilih */}
                            {selectedWilayah ? (
                                <div className="p-3.5 rounded-2xl border border-brand-blue-100 bg-brand-blue-50/40 dark:bg-slate-800 dark:border-brand-blue-900/40 flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="p-2 rounded-xl bg-brand-blue-100 dark:bg-brand-blue-950/60 text-brand-blue-600 dark:text-brand-blue-400 shrink-0 mt-0.5">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                                {selectedWilayah.nama_jalan}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Kecamatan {selectedWilayah.kecamatan?.nama_kecamatan || "-"}
                                            </p>
                                            {selectedWilayah.latitude && selectedWilayah.longitude && (
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                                                    Koordinat: {selectedWilayah.latitude}, {selectedWilayah.longitude}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData("wilayah_parkir_id", "")}
                                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                        title="Hapus pilihan titik lokasi"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-800/40">
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Silakan pilih satu titik lokasi parkir untuk penugasan petugas ini
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                Akun Juru Parkir
                            </h3>
                        </div>
                       <div className="p-5 sm:p-6 space-y-3">
                            {/* Username & Email */}
                            <TextInput
                                label="Username*"
                                placeholder="John Doe"
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                className="w-full font-medium"
                                error={errors.username}
                            />

                            <TextInput
                                label="Email*"
                                type="email"
                                placeholder="johndoe@gmail.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full font-medium"
                                error={errors.email}
                            />
                            <TextInput
                                label="Password*"
                                type="password"
                                placeholder=""
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full font-medium"
                                error={errors.password}
                            />
                        </div>
                    </Card>

                    {/* Ketentuan & Panduan */}
                    {/* <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                        <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300">
                            <ShieldCheck size={18} />
                            <h4 className="text-sm font-bold">
                                Ketentuan Registrasi Jukir
                            </h4>
                        </div>
                        <ul className="text-xs text-amber-700/90 dark:text-amber-300/80 space-y-2 list-disc ml-4 leading-relaxed">
                            <li>
                                Akun pengguna sistem (user) wajib dipilih untuk
                                hak akses dan integrasi autentikasi.
                            </li>
                            <li>
                                Satu akun user hanya dapat terhubung ke satu
                                profil juru parkir (*1-to-1 relation*).
                            </li>
                            <li>
                                Foto jukir disarankan mengenakan rompi resmi
                                Dishubkominfo atau berpakaian rapi.
                            </li>
                            <li>
                                Pastikan nomor HP aktif agar koordinator lapangan
                                dapat menghubungi secara berkala.
                            </li>
                        </ul>
                    </div> */}
                </div>
            </form>
        </MainLayout>
    );
}
