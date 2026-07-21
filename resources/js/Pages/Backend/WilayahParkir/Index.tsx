import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/Form/TextInput";
import Pagination from "@/Components/Data/Pagination";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Modal from "@/Components/UI/Modal";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import {
    Edit2,
    Trash2,
    Search,
    Plus,
    Save,
    FileUp,
    FileDown,
    Download,
    Upload,
    RotateCcw,
} from "lucide-react";
import { PaginatedData, WilayahParkir } from "@/types/model";
import axios from "axios";

interface IndexProps {
    wilayah: PaginatedData<WilayahParkir>;
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

export default function Index({ wilayah, filters }: IndexProps) {
    const { permissions } = usePage<any>().props.auth || { permissions: [] };
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedWilayah, setSelectedWilayah] =
        useState<WilayahParkir | null>(null);

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<WilayahParkir | null>(
        null,
    );

    // Form State
    // Form Hook
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        nama_jalan: "",
        kecamatan: "",
        latitude: "",
        longitude: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                setSelectedWilayah(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    // Search Debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData(route("be.wilayah-parkir.index"), {
                search,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    // Handlers
    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedWilayah(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: WilayahParkir) => {
        setIsEditMode(true);
        setSelectedWilayah(item);
        setData("nama_jalan", item.nama_jalan);
        setData("kecamatan", item.kecamatan);
        setData("latitude", item.latitude);
        setData("longitude", item.longitude);
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const openDeleteModal = (item: WilayahParkir) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        destroy(route("be.wilayah-parkir.destroy", itemToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setItemToDelete(null);
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && selectedWilayah) {
            put(route("be.wilayah-parkir.update", selectedWilayah.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("be.wilayah-parkir.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Wilayah Parkir" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Indikator
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data indikator SPBE
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={openCreateModal}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                        <span>Tambah Wilayah Parkir</span>
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            className="w-full font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            placeholder="Cari nama jalan, kecamatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {search && (
                        <Button
                            variant="danger"
                            onClick={() => {
                                setSearch("");
                                setPerPage(10);
                            }}
                            className="flex items-center gap-2"
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
                            render: (_: WilayahParkir, index: number) =>
                                (wilayah.current_page - 1) * wilayah.per_page +
                                index +
                                1,
                        },
                        {
                            header: "Nama Kecamatan",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200",
                            render: (item: WilayahParkir) => item.kecamatan,
                        },
                        {
                            header: "Nama Jalan",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200",
                            render: (item: WilayahParkir) => item.nama_jalan,
                        },
                        {
                            header: "Lokasi",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200",
                            render: (item: WilayahParkir) => (
                                <a
                                    href="https://maps.google.com/?q={item.latitude},{item.longitude}"
                                    target="_blank"
                                >
                                    {item.latitude},{item.longitude}
                                </a>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center",
                            render: (item: WilayahParkir) => (
                                <div className="flex items-center justify-center gap-2">
                                    {permissions.includes("edit-indikator") && (
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                    {permissions.includes(
                                        "delete-indikator",
                                    ) && (
                                        <button
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={wilayah.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    {/* Kiri: Info Data */}
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {wilayah.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {wilayah.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {wilayah.total}
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
                        links={wilayah.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Form */}
            <Modal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Indikator" : "Tambah Indikator"}
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
                            {processing ? "Menyimpan" : "Simpan"}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Nama Kecamatan
                        </label>
                        <TextInput
                            type="text"
                            value={data.kecamatan}
                            onChange={(e) =>
                                setData("kecamatan", e.target.value)
                            }
                            className="w-full text-sm"
                            error={errors.kecamatan}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Nama Jalan
                        </label>
                        <TextInput
                            type="text"
                            value={data.nama_jalan}
                            onChange={(e) =>
                                setData("nama_jalan", e.target.value)
                            }
                            className="w-full text-sm"
                            error={errors.nama_jalan}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Latitude
                            </label>
                            <TextInput
                                type="number"
                                value={data.latitude}
                                onChange={(e) =>
                                    setData("latitude", e.target.value)
                                }
                                className="w-full text-sm"
                                error={errors.latitude}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Longitude
                            </label>
                            <TextInput
                                type="number"
                                value={data.longitude}
                                onChange={(e) =>
                                    setData("longitude", e.target.value)
                                }
                                className="w-full text-sm"
                                error={errors.longitude}
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Indikator"
                message={`Apakah Anda yakin ingin menghapus indikator "${itemToDelete?.nama_jalan}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}
Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
