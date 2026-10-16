import React, { FormEventHandler, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import SelectInput from "@/Components/Form/SelectInput";
import SelectSearch from "@/Components/Form/SelectSearch";
import FileUpload from "@/Components/Form/FileUpload";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    User as UserIcon,
    ShieldCheck,
    MapPin,
    X,
    Coins,
} from "lucide-react";
import { Jukir, User, WilayahParkir } from "@/types/model";

interface EditProps {
    jukir: Jukir;
    wilayahParkir: WilayahParkir[];
}

export default function Edit({ jukir, wilayahParkir = [] }: EditProps) {
    // Ambil ID wilayah yang sudah tersimpan sebelumnya
    const initialWilayahId = jukir.wilayah_parkir_id
        ? jukir.wilayah_parkir_id.toString()
        : (jukir.wilayah_parkir?.id || jukir.wilayahParkir?.id || "")?.toString();

    // Ambil target aktif jika ada
    const activeTarget = jukir.targets && jukir.targets.length > 0 ? jukir.targets[0] : null;

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        nama: string;
        nohp: string;
        alamat: string;
        status: "Aktif" | "Tidak Aktif";
        foto: File | null;
        wilayah_parkir_id: string | number;
        username: string;
        email: string;
        password: string;
        target_per_hari: string | number;
        tahun: string | number;
        jml_hari: string | number;
        keterangan_target: string;
    }>({
        _method: "PUT",
        nama: jukir.nama || "",
        nohp: jukir.nohp || "",
        alamat: jukir.alamat || "",
        status: (jukir.status as "Aktif" | "Tidak Aktif") || "Aktif",
        foto: null,
        wilayah_parkir_id: initialWilayahId,
        username: jukir.user?.username || "",
        email: jukir.user?.email || "",
        password: "",
        target_per_hari: activeTarget?.target_per_hari ? Number(activeTarget.target_per_hari) : "",
        tahun: activeTarget?.tahun || new Date().getFullYear(),
        jml_hari: activeTarget?.jml_hari || 26,
        keterangan_target: activeTarget?.keterangan || "",
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

    const targetPerHariNum = parseFloat(String(data.target_per_hari || 0)) || 0;
    const jmlHariNum = parseInt(String(data.jml_hari || 26), 10) || 26;
    const totalTargetBulanan = targetPerHariNum * jmlHariNum;

    // URL preview foto: gunakan foto lama dari server jika belum memilih file baru
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        jukir.foto ? `/storage/${jukir.foto}` : null
    );

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
        // Gunakan post dengan _method: PUT agar upload multipart form-data berjalan sukses di Laravel
        post(route("be.data-jukir.update", jukir.kode_jukir || jukir.id), {
            forceFormData: true,
        });
    };

    return (
        <MainLayout>
            <Head title={`Edit Juru Parkir - ${jukir.nama}`} />

            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={route("be.data-jukir.index")}
                    className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-brand-blue-600 hover:border-brand-blue-100 transition-all shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-blue-400 active:scale-95"
                    title="Kembali ke Daftar Jukir"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        Edit Data Juru Parkir
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Perbarui informasi profil, akun login, dan titik wilayah penugasan
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* Kolom Kiri: Profil & Akun */}
                <div className="space-y-6">
                    {/* Kartu 1: Data Profil Juru Parkir */}
                    <Card>
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400">
                                    <UserIcon size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                        Data Profil Juru Parkir
                                    </h3>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        Perbarui data profil dan identitas juru parkir
                                    </p>
                                </div>
                            </div>

                            {jukir.kode_jukir && (
                                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-100 dark:bg-brand-blue-900/40 dark:text-brand-blue-300 dark:border-brand-blue-800">
                                    {jukir.kode_jukir}
                                </span>
                            )}
                        </div>

                        <div className="p-5 sm:p-6 space-y-4">
                            {/* Nama Lengkap & Nomor HP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <TextInput
                                    label="Nama Lengkap*"
                                    placeholder="Contoh: John Doe"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    className="w-full font-medium"
                                    error={errors.nama}
                                />

                                <TextInput
                                    label="Nomor HP / WhatsApp*"
                                    type="tel"
                                    placeholder="Contoh: 081234567890"
                                    value={data.nohp}
                                    onChange={(e) =>
                                        setData("nohp", e.target.value)
                                    }
                                    className="w-full font-medium"
                                    error={errors.nohp}
                                />
                            </div>

                            {/* Status Keaktifan & Alamat Tempat Tinggal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    <option value="Aktif">Aktif Bertugas</option>
                                    <option value="Tidak Aktif">
                                        Tidak Aktif / Nonaktif
                                    </option>
                                </SelectInput>

                                <TextInput
                                    label="Alamat Tempat Tinggal*"
                                    placeholder="Contoh: Jl. Sukasenang No. 12"
                                    value={data.alamat}
                                    onChange={(e) =>
                                        setData("alamat", e.target.value)
                                    }
                                    className="w-full font-medium"
                                    error={errors.alamat}
                                />
                            </div>

                            {/* Upload Foto Jukir (Opsional saat Edit) */}
                            <div>
                                <FileUpload
                                    label="Foto Profil Juru Parkir (Opsional)"
                                    required={false}
                                    error={errors.foto}
                                    previewUrl={previewUrl}
                                    onChange={handleFileChange}
                                    onRemove={handleRemoveFile}
                                    title="Klik atau seret untuk mengganti foto jukir"
                                    subtitle="Biarkan kosong jika tidak ingin mengubah foto lama (Maksimal 1MB)"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Kartu 2: Akun Login Juru Parkir */}
                    <Card>
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                    Akun Login Juru Parkir
                                </h3>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                    Kredensial akun untuk login sistem
                                </p>
                            </div>
                        </div>
                        <div className="p-5 sm:p-6 space-y-3.5">
                            <TextInput
                                label="Username*"
                                placeholder="Username login"
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
                                placeholder="email@gmail.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full font-medium"
                                error={errors.email}
                            />

                            <div className="space-y-1">
                                <TextInput
                                    label="Password Baru (Opsional)"
                                    type="password"
                                    placeholder="Biarkan kosong jika tidak diubah"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full font-medium"
                                    error={errors.password}
                                />
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                    Hanya isi jika ingin mereset/mengganti password.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Kolom Kanan: Titik Penugasan & Target Retribusi */}
                <div className="space-y-6">
                    {/* Kartu 1: Titik Wilayah Penugasan */}
                    <Card className="!overflow-visible relative z-20">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                        Titik Wilayah Penugasan
                                    </h3>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        Lokasi parkir operasional jukir
                                    </p>
                                </div>
                            </div>
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

                    {/* Kartu 2: Target Retribusi Parkir */}
                    <Card>
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-brand-green-50 text-brand-green-600 dark:bg-brand-green-950/60 dark:text-brand-green-400">
                                    <Coins size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                        Target Retribusi Parkir
                                    </h3>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        Penetapan target setoran per hari & tahun anggaran
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6 space-y-5">
                            {/* Target Per Hari, Tahun, Hari Kerja dlm 3 Kolom */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <TextInput
                                    label="Target per Hari (Rp)*"
                                    type="number"
                                    placeholder="Contoh: 15000"
                                    value={data.target_per_hari}
                                    onChange={(e) => setData("target_per_hari", e.target.value)}
                                    className="w-full font-medium"
                                    error={errors.target_per_hari}
                                />

                                <TextInput
                                    label="Tahun Anggaran*"
                                    type="number"
                                    placeholder="2026"
                                    value={data.tahun}
                                    onChange={(e) => setData("tahun", e.target.value)}
                                    className="w-full font-medium"
                                    error={errors.tahun}
                                />

                                <TextInput
                                    label="Hari Kerja / Bulan*"
                                    type="number"
                                    placeholder="26"
                                    value={data.jml_hari}
                                    onChange={(e) => setData("jml_hari", e.target.value)}
                                    className="w-full font-medium"
                                    error={errors.jml_hari}
                                />
                            </div>

                            {/* Preview Kalkulasi Total Target */}
                            <div className="p-4 rounded-2xl bg-brand-green-50/50 border border-brand-green-100 dark:bg-brand-green-950/20 dark:border-brand-green-900/40 text-xs space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                                        Estimasi Target Setoran Bulanan:
                                    </span>
                                    <span className="font-bold text-base text-brand-green-600 dark:text-brand-green-400">
                                        Rp {totalTargetBulanan.toLocaleString("id-ID")}
                                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
                                            / bulan ({jmlHariNum} hari kerja)
                                        </span>
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-brand-green-100/60 dark:border-brand-green-900/40 pt-2">
                                    Target ini otomatis diperbarui untuk 12 bulan (Januari s/d Desember) pada tahun anggaran {data.tahun || 2026}.
                                </p>
                            </div>

                            <TextInput
                                label="Keterangan (Opsional)"
                                placeholder="Contoh: Sesuai penetapan SK Wilayah Ciawi 2026"
                                value={data.keterangan_target}
                                onChange={(e) => setData("keterangan_target", e.target.value)}
                                className="w-full text-xs"
                                error={errors.keterangan_target}
                            />
                        </div>
                    </Card>
                </div>

                {/* Kolom Bawah: Action Footer Full-Width */}
                <div className="col-span-full">
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                            Pastikan data profil, titik wilayah penugasan, dan target retribusi telah terisi dengan benar sebelum menyimpan perubahan.
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
                                className="shadow-lg shadow-brand-blue-100 dark:shadow-none min-w-[160px]"
                            >
                                <span>
                                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}
