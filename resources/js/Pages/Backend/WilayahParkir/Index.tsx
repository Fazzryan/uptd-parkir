import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/Form/TextInput";
import Pagination from "@/Components/Data/Pagination";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Modal from "@/Components/UI/Modal";
import SelectSearch from "@/Components/Form/SelectSearch";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import {
    Edit2,
    Trash2,
    Search,
    MapPin,
    RotateCcw,
    ExternalLink,
    Users,
    Phone,
    UserX,
} from "lucide-react";
import { PaginatedData, WilayahParkir, Kecamatan } from "@/types/model";
import axios from "axios";

interface IndexProps {
    wilayah: PaginatedData<WilayahParkir>;
    kecamatanList: Kecamatan[];
    filters: {
        search?: string;
        kecamatan_id?: number | string;
        per_page?: number | string;
    };
}

export default function Index({ wilayah, kecamatanList = [], filters }: IndexProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const canEdit =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("edit-wilayah-parkir");

    const canDelete =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("delete-wilayah-parkir");

    const [localWilayah, setLocalWilayah] = useState<PaginatedData<WilayahParkir>>(wilayah);
    const [search, setSearch] = useState(filters.search || "");
    const [selectedKecamatanId, setSelectedKecamatanId] = useState<number | string>(filters.kecamatan_id || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    useEffect(() => {
        setLocalWilayah(wilayah);
    }, [wilayah]);

    // Opsi untuk SelectSearch Kecamatan
    const kecamatanOptions = kecamatanList.map((k) => ({
        value: String(k.id),
        label: k.nama_kecamatan,
    }));

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedWilayah, setSelectedWilayah] = useState<WilayahParkir | null>(null);

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<WilayahParkir | null>(null);

    // Jukir List Modal State
    const [showJukirModal, setShowJukirModal] = useState(false);
    const [selectedWilayahForJukir, setSelectedWilayahForJukir] = useState<WilayahParkir | null>(null);

    const openJukirModal = (item: WilayahParkir) => {
        setSelectedWilayahForJukir(item);
        setShowJukirModal(true);
    };

    const closeJukirModal = () => {
        setShowJukirModal(false);
    };

    // Form Hook
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        kecamatan_id: "" as number | string,
        nama_jalan: "",
        latitude: "",
        longitude: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                setLocalWilayah(res.data);
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
            fetchData(route("be.wilayah-parkir.index"), {
                search,
                kecamatan_id: selectedKecamatanId,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, selectedKecamatanId, perPage]);

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
        setData({
            kecamatan_id: item.kecamatan_id ? String(item.kecamatan_id) : "",
            nama_jalan: item.nama_jalan,
            latitude: item.latitude,
            longitude: item.longitude,
        });
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

        router.delete(route("be.wilayah-parkir.destroy", itemToDelete.id), {
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

    const handleResetFilter = () => {
        setSearch("");
        setSelectedKecamatanId("");
        setPerPage(10);
    };

    return (
        <>
            <Head title="Manajemen Wilayah Parkir" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Wilayah Parkir
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data titik lokasi dan titik koordinat parkir Kabupaten Tasikmalaya
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={openCreateModal}
                        className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                    >
                        <span>Tambah Wilayah Parkir</span>
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
                            placeholder="Cari lokasi jalan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Kecamatan */}
                    <div className="w-full md:w-64 relative z-30">
                        <SelectSearch
                            options={kecamatanOptions}
                            value={String(selectedKecamatanId)}
                            onChange={(val) => setSelectedKecamatanId(val)}
                            placeholder="Filter Kecamatan..."
                        />
                    </div>

                    {/* Reset Button */}
                    {(search || selectedKecamatanId) && (
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
                            render: (_: WilayahParkir, index: number) =>
                                (localWilayah.current_page - 1) * localWilayah.per_page +
                                index +
                                1,
                        },
                        {
                            header: "Kecamatan",
                            className:
                                "text-slate-800 font-bold dark:text-slate-200 w-48",
                            render: (item: WilayahParkir) =>
                                item.kecamatan?.nama_kecamatan || "-",
                        },
                        {
                            header: "Nama Jalan / Titik Lokasi",
                            className:
                                "text-slate-700 dark:text-slate-300 font-medium",
                            render: (item: WilayahParkir) => item.nama_jalan,
                        },
                        {
                            header: "Jumlah Jukir",
                            className:
                                "text-center text-slate-700 dark:text-slate-300 font-medium",
                            headerClassName: "text-center",
                            render: (item: WilayahParkir) => {
                                const count = item.jukir_count ?? (item.jukir?.length || 0);
                                return (
                                    <button
                                        type="button"
                                        onClick={() => openJukirModal(item)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue-50 text-brand-blue-700 hover:bg-brand-blue-100 hover:text-brand-blue-800 dark:bg-brand-blue-950/60 dark:text-brand-blue-400 dark:hover:bg-brand-blue-900/80 transition-all active:scale-95 cursor-pointer border border-brand-blue-200/60 dark:border-brand-blue-800/60 group "
                                        title="Klik untuk melihat daftar juru parkir"
                                    >
                                        <Users size={13} className="shrink-0 text-brand-blue-500 dark:text-brand-blue-400 group-hover:scale-110 transition-transform" />
                                        <span>{count} Jukir</span>
                                    </button>
                                );
                            },
                        },
                        {
                            header: "Koordinat (Lat, Long)",
                            className: "w-56 text-slate-500 text-xs dark:text-slate-400",
                            render: (item: WilayahParkir) => (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-brand-blue-500 shrink-0" />
                                    <span>
                                        {item.latitude}, {item.longitude}
                                    </span>
                                    {item.latitude && item.longitude && (
                                        <a
                                            href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-brand-blue-600 hover:text-brand-blue-800 dark:text-brand-blue-400 ml-1"
                                            title="Buka di Google Maps"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center",
                            render: (item: WilayahParkir) => (
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
                    data={localWilayah.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    {/* Kiri: Info Data */}
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localWilayah.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localWilayah.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localWilayah.total}
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
                        links={localWilayah.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Form */}
            <Modal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Wilayah Parkir" : "Tambah Wilayah Parkir"}
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
                            Kecamatan
                        </label>
                        <SelectSearch
                            options={kecamatanOptions}
                            value={String(data.kecamatan_id)}
                            onChange={(val) => setData("kecamatan_id", val)}
                            placeholder="Pilih Kecamatan..."
                        />
                        {errors.kecamatan_id && (
                            <p className="text-xs text-rose-500 mt-1">{errors.kecamatan_id}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Nama Jalan / Titik Lokasi
                        </label>
                        <TextInput
                            type="text"
                            placeholder="Contoh: Jl. Raya Singaparna No. 45"
                            value={data.nama_jalan}
                            onChange={(e) => setData("nama_jalan", e.target.value)}
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
                                type="text"
                                placeholder="Contoh: -7.352400"
                                value={data.latitude}
                                onChange={(e) => setData("latitude", e.target.value)}
                                className="w-full text-sm"
                                error={errors.latitude}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                                Longitude
                            </label>
                            <TextInput
                                type="text"
                                placeholder="Contoh: 108.112300"
                                value={data.longitude}
                                onChange={(e) => setData("longitude", e.target.value)}
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
                title="Hapus Wilayah Parkir"
                message={`Apakah Anda yakin ingin menghapus wilayah parkir "${itemToDelete?.nama_jalan}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            {/* Modal Daftar Jukir */}
            <Modal
                show={showJukirModal}
                onClose={closeJukirModal}
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400 shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Daftar Juru Parkir
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                {selectedWilayahForJukir?.nama_jalan} • Kecamatan {selectedWilayahForJukir?.kecamatan?.nama_kecamatan || "-"}
                            </p>
                        </div>
                    </div>
                }
                maxWidth="4xl"
                footer={
                    <Button
                        variant="secondary"
                        onClick={closeJukirModal}
                    >
                        Tutup
                    </Button>
                }
            >
                {selectedWilayahForJukir && (
                    <div>
                        {(!selectedWilayahForJukir.jukir || selectedWilayahForJukir.jukir.length === 0) ? (
                            <div className="py-10 px-4 text-center">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Belum Ada Jukir Ditugaskan
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                    Saat ini belum ada juru parkir yang terdaftar atau ditugaskan di titik lokasi ini.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">
                                    <span>
                                        Total: <strong className="text-slate-700 dark:text-slate-200">{selectedWilayahForJukir.jukir.length} Juru Parkir</strong>
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-[55vh] overflow-y-auto pr-1">
                                    {selectedWilayahForJukir.jukir.map((j) => (
                                        <div
                                            key={j.id}
                                            className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 px-2 rounded-xl transition-colors"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {j.foto ? (
                                                    <img
                                                        src={`/storage/${j.foto}`}
                                                        alt={j.nama}
                                                        className="h-10 w-10 object-cover rounded-full border border-slate-200 shadow-xs dark:border-slate-700 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                                                        <Users size={16} />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                                                            {j.nama}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                                                j.status === "Aktif"
                                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                                                                    : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800"
                                                            }`}
                                                        >
                                                            {j.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                                                        {j.kode_jukir && (
                                                            <span className="font-mono text-brand-blue-600 dark:text-brand-blue-400 font-medium">
                                                                {j.kode_jukir}
                                                            </span>
                                                        )}
                                                        {j.nohp && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone size={12} className="text-slate-400" />
                                                                {j.nohp}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={route("be.data-jukir.show", j.kode_jukir || j.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-brand-blue-600 bg-brand-blue-50 hover:bg-brand-blue-100 dark:bg-brand-blue-950/60 dark:text-brand-blue-400 dark:hover:bg-brand-blue-900/80 transition-colors shrink-0 active:scale-95"
                                                title="Lihat Detail Juru Parkir"
                                            >
                                                <span>Detail</span>
                                                <ExternalLink size={12} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
