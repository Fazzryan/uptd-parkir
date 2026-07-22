import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/Form/TextInput";
import TextArea from "@/Components/Form/TextArea";
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
} from "lucide-react";
import { PaginatedData, PanduanJukir } from "@/types/model";
import axios from "axios";

interface IndexProps {
    panduan: PaginatedData<PanduanJukir>;
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

export default function Index({ panduan, filters }: IndexProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const canEdit =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("edit-panduan-jukir");

    const canDelete =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("delete-panduan-jukir");

    const [localPanduan, setLocalPanduan] =
        useState<PaginatedData<PanduanJukir>>(panduan);
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    useEffect(() => {
        setLocalPanduan(panduan);
    }, [panduan]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPanduan, setSelectedPanduan] = useState<PanduanJukir | null>(
        null,
    );

    // Image Preview State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<PanduanJukir | null>(null);

    // Form Hook
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            teks_info: string;
            deskripsi: string;
            foto: File | null;
            _method?: string;
        }>({
            teks_info: "",
            deskripsi: "",
            foto: null,
        });

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                setLocalPanduan(res.data);
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
            fetchData(route("be.panduan-jukir.index"), {
                search,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    // Handlers
    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedPanduan(null);
        setPreviewUrl(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: PanduanJukir) => {
        setIsEditMode(true);
        setSelectedPanduan(item);
        setData({
            teks_info: item.teks_info,
            deskripsi: item.deskripsi,
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

    const openDeleteModal = (item: PanduanJukir) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(route("be.panduan-jukir.destroy", itemToDelete.id), {
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
        if (isEditMode && selectedPanduan) {
            router.post(
                route("be.panduan-jukir.update", selectedPanduan.id),
                {
                    _method: "put",
                    teks_info: data.teks_info,
                    deskripsi: data.deskripsi,
                    foto: data.foto,
                },
                {
                    onSuccess: () => closeModal(),
                },
            );
        } else {
            post(route("be.panduan-jukir.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleResetFilter = () => {
        setSearch("");
        setPerPage(10);
    };

    return (
        <>
            <Head title="Manajemen Panduan Jukir" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Panduan Jukir
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data panduan & atribut juru parkir resmi
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={openCreateModal}
                        className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                    >
                        <span>Tambah Panduan Jukir</span>
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
                            placeholder="Cari judul / deskripsi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Reset Button */}
                    {search && (
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
                            render: (_: PanduanJukir, index: number) =>
                                (localPanduan.current_page - 1) *
                                    localPanduan.per_page +
                                index +
                                1,
                        },
                        {
                            header: "Foto / Ilustrasi",
                            className: "w-32 text-center",
                            headerClassName: "text-center w-32",
                            render: (item: PanduanJukir) => (
                                <div className="flex items-center justify-center">
                                    {item.foto ? (
                                        <img
                                            src={`/storage/${item.foto}`}
                                            alt={item.teks_info}
                                            className="h-14 w-14 object-cover rounded-xl border border-slate-200 shadow-sm dark:border-slate-700"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Teks Info / Judul",
                            className:
                                "text-slate-800 font-bold dark:text-slate-200 w-64",
                            render: (item: PanduanJukir) => item.teks_info,
                        },
                        {
                            header: "Deskripsi",
                            className:
                                "text-slate-600 dark:text-slate-300 text-sm leading-relaxed",
                            render: (item: PanduanJukir) => item.deskripsi,
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center",
                            render: (item: PanduanJukir) => (
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
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer dark:hover:bg-slate-700 dark:hover:text-rose-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localPanduan.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    {/* Kiri: Info Data */}
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localPanduan.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localPanduan.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localPanduan.total}
                        </span>{" "}
                        data
                    </p>

                    {/* Tengah: Per Page Selector */}
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value))
                            }
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
                        links={localPanduan.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Form */}
            <Modal
                show={isModalOpen}
                onClose={closeModal}
                title={
                    isEditMode ? "Edit Panduan Jukir" : "Tambah Panduan Jukir"
                }
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
                            Teks Info / Judul Panduan
                        </label>
                        <TextInput
                            type="text"
                            placeholder="Contoh: Rompi Resmi"
                            value={data.teks_info}
                            onChange={(e) =>
                                setData("teks_info", e.target.value)
                            }
                            className="w-full text-sm"
                            error={errors.teks_info}
                        />
                    </div>

                    <div>
                        <TextArea
                            label="Deskripsi Panduan"
                            rows={4}
                            placeholder="Tuliskan deskripsi lengkap panduan jukir..."
                            value={data.deskripsi}
                            onChange={(e) =>
                                setData("deskripsi", e.target.value)
                            }
                            error={errors.deskripsi}
                            containerClassName="relative w-full"
                            variant="primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Foto / Ilustrasi
                        </label>
                        <div className="flex items-center gap-4">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-20 w-20 object-cover rounded-xl border border-slate-200 shadow-sm dark:border-slate-700"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-xl bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-600">
                                    <ImageIcon size={24} />
                                    <span className="text-[10px] mt-1">
                                        Preview
                                    </span>
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
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    <span>Pilih Gambar</span>
                                </Button>
                                <p className="text-xs text-slate-400 mt-1">
                                    Format: JPG, PNG, WEBP. Maks: 2MB.
                                </p>
                            </div>
                        </div>
                        {errors.foto && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.foto}
                            </p>
                        )}
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Panduan Jukir"
                message={`Apakah Anda yakin ingin menghapus panduan "${itemToDelete?.teks_info}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
