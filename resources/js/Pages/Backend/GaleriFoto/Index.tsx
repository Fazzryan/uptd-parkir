import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/Form/TextInput";
import Pagination from "@/Components/Data/Pagination";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Modal from "@/Components/UI/Modal";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import {
    Edit2,
    Trash2,
    Search,
    RotateCcw,
    Image as ImageIcon,
    Upload,
    Calendar,
} from "lucide-react";
import { PaginatedData, GaleriFoto } from "@/types/model";
import axios from "axios";

interface IndexProps {
    galeri: PaginatedData<GaleriFoto>;
    filters: {
        search?: string;
        kategori?: string;
        per_page?: number | string;
    };
}

export default function Index({ galeri, filters }: IndexProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const canEdit =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("edit-galeri-foto");

    const canDelete =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("delete-galeri-foto");

    const [localGaleri, setLocalGaleri] = useState<PaginatedData<GaleriFoto>>(galeri);
    const [search, setSearch] = useState(filters.search || "");
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategori || "Semua");
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    useEffect(() => {
        setLocalGaleri(galeri);
    }, [galeri]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedGaleri, setSelectedGaleri] = useState<GaleriFoto | null>(null);

    // Image Preview State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<GaleriFoto | null>(null);

    // Form Hook
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<{
        caption: string;
        kategori: string;
        tanggal: string;
        foto: File | null;
        _method?: string;
    }>({
        caption: "",
        kategori: "Penertiban",
        tanggal: new Date().toISOString().split("T")[0],
        foto: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                setLocalGaleri(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    // Search & Filter Debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData(route("be.galeri-foto.index"), {
                search,
                kategori: kategoriFilter,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, kategoriFilter, perPage]);

    // Handlers
    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedGaleri(null);
        setPreviewUrl(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: GaleriFoto) => {
        setIsEditMode(true);
        setSelectedGaleri(item);
        setData({
            caption: item.caption,
            kategori: item.kategori,
            tanggal: item.tanggal ? String(item.tanggal).split("T")[0] : new Date().toISOString().split("T")[0],
            foto: null,
        });
        setPreviewUrl(item.foto ? `/storage/${item.foto}` : null);
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPreviewUrl(null);
        reset();
    };

    const openDeleteModal = (item: GaleriFoto) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(route("be.galeri-foto.destroy", itemToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setItemToDelete(null);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData("foto", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && selectedGaleri) {
            router.post(
                route("be.galeri-foto.update", selectedGaleri.id),
                {
                    _method: "put",
                    caption: data.caption,
                    kategori: data.kategori,
                    tanggal: data.tanggal,
                    foto: data.foto,
                },
                {
                    onSuccess: () => closeModal(),
                }
            );
        } else {
            post(route("be.galeri-foto.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleResetFilter = () => {
        setSearch("");
        setKategoriFilter("Semua");
        setPerPage(10);
    };

    return (
        <>
            <Head title="Manajemen Galeri Foto" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Galeri Foto
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola dokumentasi foto kegiatan penertiban, pembinaan, dan acara UPTD
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={openCreateModal}
                        className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                    >
                        <span>Tambah Foto Galeri</span>
                    </Button>
                </div>
            </div>

            <Card className="!overflow-visible relative z-30 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4 relative z-30 overflow-visible">
                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            className="w-full font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            placeholder="Cari caption foto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Kategori */}
                    <div className="w-full md:w-56">
                        <select
                            value={kategoriFilter}
                            onChange={(e) => setKategoriFilter(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value="Semua">Semua Kategori</option>
                            <option value="Penertiban">Penertiban</option>
                            <option value="Pembinaan">Pembinaan</option>
                            <option value="Sosialisasi">Sosialisasi</option>
                            <option value="Kegiatan">Kegiatan</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    {(search || kategoriFilter !== "Semua") && (
                        <Button
                            variant="danger"
                            onClick={handleResetFilter}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <RotateCcw size={16} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                {/* Tabel */}
                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className:
                                "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-16",
                            headerClassName: "text-center w-16",
                            render: (_: GaleriFoto, index: number) =>
                                (localGaleri.current_page - 1) * localGaleri.per_page +
                                index +
                                1,
                        },
                        {
                            header: "Foto",
                            className: "w-32 text-center",
                            headerClassName: "text-center w-32",
                            render: (item: GaleriFoto) => (
                                <div className="flex items-center justify-center">
                                    {item.foto ? (
                                        <img
                                            src={`/storage/${item.foto}`}
                                            alt={item.caption}
                                            className="h-14 w-20 object-cover rounded-xl border border-slate-200 shadow-sm dark:border-slate-700"
                                        />
                                    ) : (
                                        <div className="h-14 w-20 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Caption / Keterangan",
                            className:
                                "text-slate-800 font-bold dark:text-slate-200",
                            render: (item: GaleriFoto) => item.caption,
                        },
                        {
                            header: "Kategori",
                            className: "w-40",
                            render: (item: GaleriFoto) => (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-900/30 dark:text-brand-blue-300">
                                    {item.kategori}
                                </span>
                            ),
                        },
                        {
                            header: "Tanggal Kegiatan",
                            className: "text-slate-600 dark:text-slate-300 text-sm w-44",
                            render: (item: GaleriFoto) => (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span>{String(item.tanggal).split("T")[0]}</span>
                                </div>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center",
                            render: (item: GaleriFoto) => (
                                <div className="flex items-center justify-center gap-2">
                                    {canEdit && (
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2.5 text-slate-400 hover:text-brand-blue-600 hover:bg-brand-blue-50 rounded-xl active:scale-90 transition-all cursor-pointer dark:hover:bg-slate-700 dark:hover:text-brand-blue-400"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() => openDeleteModal(item)}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer dark:hover:bg-slate-700 dark:hover:text-rose-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localGaleri.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    {/* Kiri: Info Data */}
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localGaleri.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localGaleri.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localGaleri.total}
                        </span>{" "}
                        data
                    </p>

                    {/* Tengah: Per Page Selector */}
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(parseInt(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-3 focus:ring-brand-green-500/10 focus:border-brand-green-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    {/* Kanan: Pagination */}
                    <Pagination
                        links={localGaleri.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Form */}
            <Modal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Galeri Foto" : "Tambah Galeri Foto"}
                maxWidth="xl"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={closeModal}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Caption / Deskripsi Foto
                        </label>
                        <TextInput
                            type="text"
                            placeholder="Contoh: Penertiban jukir tidak berseragam di Singaparna"
                            value={data.caption}
                            onChange={(e) => setData("caption", e.target.value)}
                            className="w-full text-sm"
                            error={errors.caption}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Kategori
                            </label>
                            <select
                                value={data.kategori}
                                onChange={(e) => setData("kategori", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            >
                                <option value="Penertiban">Penertiban</option>
                                <option value="Pembinaan">Pembinaan</option>
                                <option value="Sosialisasi">Sosialisasi</option>
                                <option value="Kegiatan">Kegiatan</option>
                            </select>
                            {errors.kategori && (
                                <p className="text-xs text-rose-500 mt-1">{errors.kategori}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Tanggal Kegiatan
                            </label>
                            <TextInput
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData("tanggal", e.target.value)}
                                className="w-full text-sm"
                                error={errors.tanggal}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Foto Kegiatan
                        </label>
                        <div className="flex items-center gap-4">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-20 w-28 object-cover rounded-xl border border-slate-200 shadow-sm dark:border-slate-700"
                                />
                            ) : (
                                <div className="h-20 w-28 rounded-xl bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-600">
                                    <ImageIcon size={24} />
                                    <span className="text-[10px] mt-1">Preview</span>
                                </div>
                            )}

                            <div className="flex-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    <span>Pilih Foto</span>
                                </Button>
                                <p className="text-xs text-slate-400 mt-1">
                                    Format: JPG, PNG, WEBP. Maks: 2MB.
                                </p>
                            </div>
                        </div>
                        {errors.foto && (
                            <p className="text-xs text-rose-500 mt-1">{errors.foto}</p>
                        )}
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Galeri Foto"
                message={`Apakah Anda yakin ingin menghapus foto "${itemToDelete?.caption}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
