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
    Images,
    X,
    Plus,
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

interface ExistingPhotoItem {
    id: number;
    foto: string;
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

    // Existing Photos & Deleted Photo IDs State
    const [existingItems, setExistingItems] = useState<ExistingPhotoItem[]>([]);
    const [deletedItemIds, setDeletedItemIds] = useState<number[]>([]);
    const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
    const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
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
        foto?: string;
        fotos?: string;
    }>({
        caption: "",
        kategori: "Penertiban",
        tanggal: new Date().toISOString().split("T")[0],
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
        setExistingItems([]);
        setDeletedItemIds([]);
        setNewPhotoFiles([]);
        setNewPhotoPreviews([]);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: any) => {
        setIsEditMode(true);
        setSelectedGaleri(item);
        setData({
            caption: item.caption,
            kategori: item.kategori,
            tanggal: item.tanggal ? String(item.tanggal).split("T")[0] : new Date().toISOString().split("T")[0],
        });

        // Set existing items
        if (item.items && Array.isArray(item.items) && item.items.length > 0) {
            setExistingItems(item.items.map((i: any) => ({ id: i.id, foto: i.foto })));
        } else if (item.foto) {
            setExistingItems([{ id: 0, foto: item.foto }]);
        } else {
            setExistingItems([]);
        }

        setDeletedItemIds([]);
        setNewPhotoFiles([]);
        setNewPhotoPreviews([]);
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setExistingItems([]);
        setDeletedItemIds([]);
        setNewPhotoFiles([]);
        setNewPhotoPreviews([]);
        reset();
    };

    const handleDeleteExistingItem = (id: number) => {
        if (id > 0) {
            setDeletedItemIds((prev) => [...prev, id]);
        }
        setExistingItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleRemoveNewPhoto = (index: number) => {
        setNewPhotoFiles((prev) => prev.filter((_, i) => i !== index));
        setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalExisting = existingItems.length;
        const availableSlots = Math.max(0, 4 - totalExisting - newPhotoFiles.length);

        if (availableSlots <= 0) return;

        const filesToAdd = files.slice(0, availableSlots);
        setNewPhotoFiles((prev) => [...prev, ...filesToAdd]);

        const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));
        setNewPhotoPreviews((prev) => [...prev, ...newUrls]);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("caption", data.caption);
        formData.append("kategori", data.kategori);
        formData.append("tanggal", data.tanggal);

        // Files baru
        newPhotoFiles.forEach((file, index) => {
            formData.append(`fotos[${index}]`, file);
        });

        // Deleted item IDs (saat edit)
        deletedItemIds.forEach((id, index) => {
            formData.append(`deleted_item_ids[${index}]`, String(id));
        });

        if (isEditMode && selectedGaleri) {
            formData.append("_method", "put");
            router.post(route("be.galeri-foto.update", selectedGaleri.id), formData, {
                onSuccess: () => closeModal(),
            });
        } else {
            router.post(route("be.galeri-foto.store"), formData, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleResetFilter = () => {
        setSearch("");
        setKategoriFilter("Semua");
        setPerPage(10);
    };

    const totalCurrentPhotos = existingItems.length + newPhotoFiles.length;

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
                        Kelola dokumentasi foto kegiatan UPTD (maksimal 4 foto per kegiatan)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={openCreateModal}
                        className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                    >
                        <span>Tambah Kegiatan / Foto</span>
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
                            header: "Foto Kegiatan",
                            className: "w-36 text-center",
                            headerClassName: "text-center w-36",
                            render: (item: any) => {
                                const photoList = item.items && item.items.length > 0
                                    ? item.items.map((i: any) => i.foto)
                                    : item.fotos && item.fotos.length > 0
                                    ? item.fotos
                                    : item.foto
                                    ? [item.foto]
                                    : [];

                                return (
                                    <div className="flex items-center justify-center relative">
                                        {photoList.length > 0 ? (
                                            <div className="relative">
                                                <img
                                                    src={`/storage/${photoList[0]}`}
                                                    alt={item.caption}
                                                    className="h-14 w-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                                                />
                                                {photoList.length > 1 && (
                                                    <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white flex items-center gap-0.5">
                                                        <Images size={10} />
                                                        {photoList.length}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-14 w-20 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                );
                            },
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
                title={isEditMode ? "Edit Galeri Foto Kegiatan" : "Tambah Galeri Foto (Maks 4 Foto)"}
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
                            Caption / Deskripsi Kegiatan
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
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Daftar Foto Kegiatan (Maksimal 4 Foto)
                            </label>
                            <span className="text-xs font-semibold text-slate-500">
                                {totalCurrentPhotos}/4 Foto
                            </span>
                        </div>

                        {/* List Foto Eksisting + Foto Baru */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {/* 1. Foto Eksisting */}
                                {existingItems.map((item, idx) => (
                                    <div
                                        key={`existing-${item.id}-${idx}`}
                                        className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs group"
                                    >
                                        <img
                                            src={`/storage/${item.foto}`}
                                            alt={`Existing ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteExistingItem(item.id)}
                                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-md"
                                            title="Hapus foto ini"
                                        >
                                            <X size={12} />
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                            Eksisting
                                        </span>
                                    </div>
                                ))}

                                {/* 2. Foto Baru yang Baru Diupload */}
                                {newPhotoPreviews.map((url, idx) => (
                                    <div
                                        key={`new-${idx}`}
                                        className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-xs group"
                                    >
                                        <img
                                            src={url}
                                            alt={`New ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewPhoto(idx)}
                                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-md"
                                            title="Batal upload foto ini"
                                        >
                                            <X size={12} />
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                            Baru #{idx + 1}
                                        </span>
                                    </div>
                                ))}

                                {/* Placeholder jika belum ada foto sama sekali */}
                                {totalCurrentPhotos === 0 && (
                                    <div className="h-20 w-28 rounded-xl bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-600">
                                        <ImageIcon size={24} />
                                        <span className="text-[10px] mt-1">Belum ada foto</span>
                                    </div>
                                )}
                            </div>

                            {/* Tombol Upload Tambah Foto */}
                            {totalCurrentPhotos < 4 && (
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        multiple
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 w-full justify-center py-2.5"
                                    >
                                        <Upload size={16} />
                                        <span>
                                            {totalCurrentPhotos > 0
                                                ? `Tambah Foto Lagi (${4 - totalCurrentPhotos} Slot Tersisa)`
                                                : "Pilih Foto Kegiatan (Maks 4 Foto)"}
                                        </span>
                                    </Button>
                                    <p className="text-xs text-slate-400 mt-1.5 text-center">
                                        Format: JPG, PNG, WEBP. Maksimal 4 foto per kegiatan (Maks 2MB/foto).
                                    </p>
                                </div>
                            )}
                        </div>

                        {(errors.foto || errors.fotos) && (
                            <p className="text-xs text-rose-500 mt-1">{errors.foto || errors.fotos}</p>
                        )}
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Galeri Foto"
                message={`Apakah Anda yakin ingin menghapus foto kegiatan "${itemToDelete?.caption}"? Seluruh foto pada kegiatan ini akan terhapus secara permanen.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
