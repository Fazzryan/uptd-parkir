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
import Badge from "@/Components/UI/Badge";
import SelectSearch from "@/Components/Form/SelectSearch";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import {
    Edit2,
    Trash2,
    Search,
    RotateCcw,
    Image as ImageIcon,
    Upload,
    Eye,
} from "lucide-react";
import { PaginatedData, Jukir, Kecamatan } from "@/types/model";
import axios from "axios";

interface IndexProps {
    jukir: PaginatedData<Jukir>;
    kecamatanList?: Kecamatan[];
    filters: {
        search?: string;
        kecamatan_id?: number | string;
        per_page?: number | string;
    };
}

export default function Index({ jukir, kecamatanList = [], filters }: IndexProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const roles: string[] = auth.roles || [];

    const canCreate =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("create-jukir");

    const canEdit =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("edit-jukir");

    const canDelete =
        roles.includes("admin") ||
        roles.includes("user") ||
        permissions.length === 0 ||
        permissions.includes("delete-jukir");

    const [localJukir, setLocalJukir] =
        useState<PaginatedData<Jukir>>(jukir);
    const [search, setSearch] = useState(filters.search || "");
    const [selectedKecamatanId, setSelectedKecamatanId] = useState<number | string>(filters.kecamatan_id || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    useEffect(() => {
        setLocalJukir(jukir);
    }, [jukir]);

    // Opsi untuk SelectSearch Kecamatan
    const kecamatanOptions = kecamatanList.map((k) => ({
        value: String(k.id),
        label: k.nama_kecamatan,
    }));

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Jukir | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                setLocalJukir(res.data);
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
            fetchData(route("be.data-jukir.index"), {
                search,
                kecamatan_id: selectedKecamatanId,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, selectedKecamatanId, perPage]);

    const openDeleteModal = (item: Jukir) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        router.delete(route("be.data-jukir.destroy", itemToDelete.kode_jukir || itemToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setItemToDelete(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleResetFilter = () => {
        setSearch("");
        setSelectedKecamatanId("");
        setPerPage(10);
    };

    return (
        <>
            <Head title="Manajemen Juru Parkir" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Juru Parkir
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data juru parkir dan wilayah cakupan
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {canCreate && (
                        <Button
                            variant="primary"
                            href={route("be.data-jukir.create")}
                            className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                        >
                            <span>Tambah Juru Parkir</span>
                        </Button>
                    )}
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
                            placeholder="Cari jukir..."
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
                            render: (_: Jukir, index: number) =>
                                (localJukir.current_page - 1) *
                                    localJukir.per_page +
                                index +
                                1,
                        },
                        {
                            header: "Foto",
                            className: "w-24 text-center",
                            headerClassName: "text-center w-24",
                            render: (item: Jukir) => {
                                const fotoUrl =
                                    item.foto &&
                                    item.foto !== "" &&
                                    !item.foto.includes("default")
                                        ? item.foto.startsWith("http") ||
                                          item.foto.startsWith("/") ||
                                          item.foto.startsWith("assets/")
                                            ? item.foto.startsWith("/")
                                                ? item.foto
                                                : `/${item.foto}`
                                            : `/storage/${item.foto}`
                                        : "/assets/images/dump.jpg";

                                return (
                                    <div className="flex items-center justify-center">
                                        <img
                                            src={fotoUrl}
                                            alt={item.nama}
                                            className="h-14 w-14 object-cover rounded-full border border-slate-200 shadow-sm dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/assets/images/dump.jpg";
                                            }}
                                        />
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Nama",
                            className:
                                "text-slate-800 font-bold dark:text-slate-200 w-48",
                            render: (item: Jukir) => {
                                const wilayah = item.wilayah_parkir || item.wilayahParkir;
                                return (
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                            {item.nama}
                                        </p>
                                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                            {item.kode_jukir && (
                                                <span className="text-[11px] font-bold text-brand-blue-600 dark:text-brand-blue-400">
                                                    {item.kode_jukir}
                                                </span>
                                            )}
                                            {wilayah?.kecamatan?.nama_kecamatan && (
                                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                    • {wilayah.kecamatan.nama_kecamatan}
                                                </span>
                                            )}
                                        </div>
                                        {wilayah?.nama_jalan && (
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5" title={wilayah.nama_jalan}>
                                                {wilayah.nama_jalan}
                                            </p>
                                        )}
                                    </div>
                                );
                            },
                        },
                        {
                            header: "No. HP",
                            className:
                                "text-slate-600 dark:text-slate-300 text-sm",
                            render: (item: Jukir) => item.nohp,
                        },
                        {
                            header: "Alamat",
                            className:
                                "text-slate-600 dark:text-slate-300 text-sm max-w-xs",
                            render: (item: Jukir) => item.alamat,
                        },
                        {
                            header: "Target Harian",
                            className: "text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap",
                            render: (item: Jukir) => {
                                const activeTarget = item.targets && item.targets.length > 0 ? item.targets[0] : null;
                                const targetNominal = activeTarget?.target_per_hari ? Number(activeTarget.target_per_hari) : null;
                                return targetNominal ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-700 bg-brand-green-50 px-2.5 py-1 rounded-full dark:bg-brand-green-700/60 dark:text-brand-green-400 border border-brand-green-200/60 dark:border-brand-green-800/60">
                                        Rp {targetNominal.toLocaleString("id-ID")}
                                        <span className="text-[10px] text-brand-green-600/80 dark:text-brand-green-400/80 font-normal">/hr</span>
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Belum diatur</span>
                                );
                            },
                        },
                        {
                            header: "Status",
                            className: "text-center",
                            headerClassName: "text-center w-32",
                            render: (item: Jukir) => (
                                <Badge
                                    type={item.status === "Aktif" ? "success" : "danger"}
                                >
                                    {item.status}
                                </Badge>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center",
                            render: (item: Jukir) => (
                                <div className="flex items-center justify-center gap-2">
                                    <Link
                                        href={route("be.data-jukir.show", item.kode_jukir || item.id)}
                                        className="p-2.5 text-slate-400 hover:text-brand-blue-600 hover:bg-brand-blue-50 rounded-xl active:scale-90 transition-all cursor-pointer dark:hover:bg-slate-700 dark:hover:text-brand-blue-400"
                                        title="Lihat Detail Juru Parkir"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                    {canEdit && (
                                        <Link
                                            href={route("be.data-jukir.edit", item.kode_jukir || item.id)}
                                            className="p-2.5 text-slate-400 hover:text-brand-blue-600 hover:bg-brand-blue-50 rounded-xl active:scale-90 transition-all cursor-pointer dark:hover:bg-slate-700 dark:hover:text-brand-blue-400"
                                            title="Edit Data Juru Parkir"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                            className={`p-2.5 rounded-xl active:scale-90 transition-all cursor-pointer ${
                                                item.status === "Aktif"
                                                    ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 dark:hover:text-rose-400"
                                                    : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 dark:hover:text-emerald-400"
                                            }`}
                                            title={
                                                item.status === "Aktif"
                                                    ? "Nonaktifkan Juru Parkir"
                                                    : "Aktifkan Kembali Juru Parkir"
                                            }
                                        >
                                            {item.status === "Aktif" ? (
                                                <Trash2 size={16} />
                                            ) : (
                                                <RotateCcw size={16} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localJukir.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    {/* Kiri: Info Data */}
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localJukir.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localJukir.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localJukir.total}
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
                        links={localJukir.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Konfirmasi Nonaktifkan / Aktifkan */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={isDeleting}
                title={
                    itemToDelete?.status === "Aktif"
                        ? "Nonaktifkan Jukir"
                        : "Aktifkan Kembali Jukir"
                }
                message={
                    itemToDelete?.status === "Aktif"
                        ? `Apakah Anda yakin ingin menonaktifkan juru parkir "${itemToDelete?.nama}"? Jukir yang dinonaktifkan tidak dapat login ke sistem.`
                        : `Apakah Anda yakin ingin mengaktifkan kembali juru parkir "${itemToDelete?.nama}"?`
                }
                confirmText={
                    itemToDelete?.status === "Aktif"
                        ? "Ya, Nonaktifkan"
                        : "Ya, Aktifkan"
                }
                confirmVariant={
                    itemToDelete?.status === "Aktif" ? "danger" : "primary"
                }
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
