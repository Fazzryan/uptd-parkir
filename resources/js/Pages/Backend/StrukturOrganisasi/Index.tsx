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
    User as UserIcon,
    Upload,
    CreditCard,
} from "lucide-react";
import { PaginatedData, StrukturOrganisasiPersonel } from "@/types/model";
import axios from "axios";

interface IndexProps {
    personel: PaginatedData<StrukturOrganisasiPersonel>;
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

export default function Index({ personel, filters }: IndexProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const canEdit =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("edit-struktur-organisasi");

    const canDelete =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("delete-struktur-organisasi");

    const [localPersonel, setLocalPersonel] =
        useState<PaginatedData<StrukturOrganisasiPersonel>>(personel);
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    useEffect(() => {
        setLocalPersonel(personel);
    }, [personel]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPersonel, setSelectedPersonel] =
        useState<StrukturOrganisasiPersonel | null>(null);

    // Image Preview State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] =
        useState<StrukturOrganisasiPersonel | null>(null);

    // Form Hook
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            nama: string;
            jabatan: string;
            nip: string;
            foto: File | null;
            _method?: string;
        }>({
            nama: "",
            jabatan: "",
            nip: "",
            foto: null,
        });

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    };

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                setLocalPersonel(res.data);
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
            fetchData(route("be.struktur-organisasi.index"), {
                search,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    // Handlers
    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedPersonel(null);
        setPreviewUrl(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: StrukturOrganisasiPersonel) => {
        setIsEditMode(true);
        setSelectedPersonel(item);
        setData({
            nama: item.nama,
            jabatan: item.jabatan,
            nip: item.nip || "",
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

    const openDeleteModal = (item: StrukturOrganisasiPersonel) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(
            route("be.struktur-organisasi.destroy", itemToDelete.id),
            {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                },
            },
        );
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
        if (isEditMode && selectedPersonel) {
            router.post(
                route("be.struktur-organisasi.update", selectedPersonel.id),
                {
                    _method: "put",
                    nama: data.nama,
                    jabatan: data.jabatan,
                    nip: data.nip,
                    foto: data.foto,
                },
                {
                    onSuccess: () => closeModal(),
                },
            );
        } else {
            post(route("be.struktur-organisasi.store"), {
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
            <Head title="Struktur Organisasi & Personel" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Struktur Organisasi & Personel
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data pimpinan, kasubag, dan kolektor UPTD
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={openCreateModal}
                        className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                    >
                        <span>Tambah Personel</span>
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
                            placeholder="Cari nama, NIP, jabatan..."
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
                            render: (
                                _: StrukturOrganisasiPersonel,
                                index: number,
                            ) =>
                                (localPersonel.current_page - 1) *
                                    localPersonel.per_page +
                                index +
                                1,
                        },
                        {
                            header: "Foto / Avatar",
                            className: "w-28 text-center",
                            headerClassName: "text-center w-28",
                            render: (item: StrukturOrganisasiPersonel) => (
                                <div className="flex items-center justify-center">
                                    {item.foto ? (
                                        <img
                                            src={`/storage/${item.foto}`}
                                            alt={item.nama}
                                            className="h-12 w-12 object-cover rounded-full border-2 border-white shadow-sm ring-2 ring-brand-blue-100 dark:ring-slate-700"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-blue-600 to-brand-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-brand-blue-100 dark:ring-slate-700">
                                            {getInitials(item.nama)}
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Nama Lengkap",
                            className:
                                "text-slate-800 font-bold dark:text-slate-200",
                            render: (item: StrukturOrganisasiPersonel) => (
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">
                                        {item.nama}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            header: "Jabatan",
                            className: "w-64",
                            render: (item: StrukturOrganisasiPersonel) => (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-900/30 dark:text-brand-blue-300">
                                    {item.jabatan}
                                </span>
                            ),
                        },
                        {
                            header: "NIP",
                            className:
                                "text-slate-600 dark:text-slate-300 text-sm w-56",
                            render: (item: StrukturOrganisasiPersonel) => (
                                <span>{item.nip ? `${item.nip}` : "-"}</span>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center",
                            render: (item: StrukturOrganisasiPersonel) => (
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
                    data={localPersonel.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    {/* Kiri: Info Data */}
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localPersonel.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localPersonel.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localPersonel.total}
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
                        links={localPersonel.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Form */}
            <Modal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Personel" : "Tambah Personel"}
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
                            Nama Lengkap & Gelar
                        </label>
                        <TextInput
                            type="text"
                            placeholder="Contoh: Drs. H. Ahmad Fauzi, M.Si"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            className="w-full text-sm"
                            error={errors.nama}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Jabatan
                            </label>
                            <TextInput
                                type="text"
                                placeholder="Contoh: Kepala UPTD Pengelola Parkir"
                                value={data.jabatan}
                                onChange={(e) =>
                                    setData("jabatan", e.target.value)
                                }
                                className="w-full text-sm"
                                error={errors.jabatan}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                NIP (Nomor Induk Pegawai)
                            </label>
                            <TextInput
                                type="text"
                                placeholder="Contoh: 197503121998031002"
                                value={data.nip}
                                onChange={(e) => setData("nip", e.target.value)}
                                className="w-full text-sm"
                                error={errors.nip}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Foto Personel
                        </label>
                        <div className="flex items-center gap-4">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-20 w-20 object-cover rounded-full border border-slate-200 shadow-sm dark:border-slate-700"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-brand-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                    {data.nama ? (
                                        getInitials(data.nama)
                                    ) : (
                                        <UserIcon size={24} />
                                    )}
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
                                    <span>Pilih Foto</span>
                                </Button>
                                <p className="text-xs text-slate-400 mt-1">
                                    Format: JPG, PNG, WEBP. Maks: 2MB.
                                    (Opsional)
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
                title="Hapus Personel"
                message={`Apakah Anda yakin ingin menghapus data personel "${itemToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
