import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import SelectSearch from "@/Components/Form/SelectSearch";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Search, Edit2, Trash2, RotateCcw, Plus, Mail, ShieldCheck, UserCheck } from "lucide-react";
import { PaginatedData, User } from "@/types/model";
import axios from "axios";

interface RoleItem {
    id: number;
    name: string;
}

interface IndexProps {
    users: PaginatedData<User>;
    rolesList?: RoleItem[];
    filters: {
        search?: string;
        role?: string;
        per_page?: number | string;
    };
}

export default function Index({ users, rolesList = [], filters = {} }: IndexProps) {
    const auth = usePage<any>().props.auth || {};
    const permissions: string[] = auth.permissions || [];
    const userRoles: string[] = auth.roles || [];

    const canCreate =
        userRoles.includes("admin") ||
        permissions.length === 0 ||
        permissions.includes("create-user");

    const canEdit =
        userRoles.includes("admin") ||
        permissions.length === 0 ||
        permissions.includes("edit-user");

    const canDelete =
        userRoles.includes("admin") ||
        permissions.length === 0 ||
        permissions.includes("delete-user");

    const [localUsers, setLocalUsers] = useState<PaginatedData<User>>(users);
    const [search, setSearch] = useState(filters.search || "");
    const [selectedRole, setSelectedRole] = useState(filters.role || "");
    const [perPage, setPerPage] = useState<number | string>(filters.per_page || 10);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const isFirstRender = useRef(true);

    // Form hook untuk delete
    const { delete: destroy, processing: isDeleting } = useForm({});

    // Sinkronisasi data ketika users prop dari Inertia berubah
    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

    // Opsi Role untuk dropdown filter
    const roleOptions = [
        { value: "", label: "Semua Hak Akses / Role" },
        ...(rolesList.length > 0
            ? rolesList.map((r) => ({
                  value: r.name,
                  label: `Role: ${r.name.toUpperCase()}`,
              }))
            : [
                  { value: "admin", label: "Role: ADMIN" },
                  { value: "user", label: "Role: USER / BENDAHARA" },
                  { value: "jukir", label: "Role: JUKIR" },
              ]),
    ];

    // Fungsi fetch data via AJAX
    const fetchData = (overrideUrl?: string, overrideParams: Record<string, any> = {}) => {
        setIsLoading(true);
        const targetUrl = overrideUrl || route("be.users.index");
        const params = {
            search,
            role: selectedRole,
            per_page: perPage,
            ...overrideParams,
        };

        axios
            .get(targetUrl, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data && res.data.data) {
                    setLocalUsers(res.data);
                } else if (res.data && res.data.props && res.data.props.users) {
                    setLocalUsers(res.data.props.users);
                }
            })
            .catch((err) => console.error("Error fetching users:", err))
            .finally(() => setIsLoading(false));
    };

    // Debounce untuk Search, Role, dan PerPage
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData(route("be.users.index"), { page: 1 });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, selectedRole, perPage]);

    const handleResetFilter = () => {
        setSearch("");
        setSelectedRole("");
        setPerPage(10);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedUser) return;

        destroy(route("be.users.destroy", selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
                fetchData(route("be.users.index"));
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Manajemen User - UPTD Parkir" />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        Manajemen Pengguna & Hak Akses
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola akun pengguna, petugas bendahara UPTD, dan akun juru parkir
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {canCreate && (
                        <Button
                            variant="primary"
                            href={route("be.users.create")}
                            className="shadow-sm flex items-center gap-2"
                        >
                            <Plus size={16} />
                            <span>Tambah User</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="!overflow-visible relative z-30 dark:bg-slate-800 dark:border-slate-700">
                {/* Filter & Search Toolbar */}
                <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 relative z-30 bg-white dark:bg-slate-800 rounded-t-3xl">
                    <div className="flex-1 min-w-[240px]">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari nama, username, atau email..."
                            className="w-full text-sm font-medium dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-full sm:w-60">
                        <SelectSearch
                            options={roleOptions}
                            value={selectedRole}
                            onChange={(val) => setSelectedRole(String(val))}
                            placeholder="Semua Hak Akses..."
                        />
                    </div>

                    {(search || selectedRole) && (
                        <Button
                            variant="danger"
                            onClick={handleResetFilter}
                            className="flex items-center gap-1.5 text-xs py-2 px-3 shadow-xs"
                        >
                            <RotateCcw size={14} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                {/* Table Section */}
                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className: "text-center text-xs font-medium text-slate-400 dark:text-slate-300 w-12",
                            headerClassName: "text-center w-12",
                            render: (_: User, index: number) => {
                                const currentPage = localUsers.current_page ?? 1;
                                const perPageVal = Number(localUsers.per_page) || 10;
                                return (currentPage - 1) * perPageVal + index + 1;
                            },
                        },
                        {
                            header: "PENGGUNA",
                            className: "w-72 text-xs",
                            render: (user: User) => (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-950/60 dark:text-brand-blue-400 flex items-center justify-center font-bold text-xs border border-brand-blue-100 dark:border-brand-blue-900/50 uppercase shrink-0 shadow-xs">
                                        {user.name.substring(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "EMAIL",
                            className: "w-64 text-xs text-slate-600 dark:text-slate-300",
                            render: (user: User) => (
                                <div className="flex items-center gap-1.5">
                                    <Mail size={13} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                            ),
                        },
                        {
                            header: "HAK AKSES / ROLE",
                            className: "w-44 text-center",
                            headerClassName: "text-center w-44",
                            render: (user: User) => {
                                const roleList = Array.isArray(user.roles) ? user.roles : [];
                                return (
                                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                                        {roleList.length > 0 ? (
                                            roleList.map((role: any, idx: number) => {
                                                const roleName = typeof role === "string" ? role : role.name;
                                                const badgeType =
                                                    roleName === "admin"
                                                        ? "danger"
                                                        : roleName === "jukir"
                                                        ? "warning"
                                                        : "info";
                                                return (
                                                    <Badge
                                                        key={role.id || idx}
                                                        type={badgeType}
                                                        className="font-bold tracking-wider"
                                                    >
                                                        {roleName}
                                                    </Badge>
                                                );
                                            })
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">
                                                Tanpa Role
                                            </span>
                                        )}
                                    </div>
                                );
                            },
                        },
                        {
                            header: "TERDAFTAR",
                            className: "w-40 text-xs text-slate-500 dark:text-slate-400 text-center",
                            headerClassName: "text-center w-40",
                            render: (user: User) =>
                                user.created_at
                                    ? new Date(user.created_at).toLocaleDateString("id-ID", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : "—",
                        },
                        {
                            header: "AKSI",
                            headerClassName: "text-center w-24",
                            className: "text-center w-24",
                            render: (user: User) => (
                                <div className="flex items-center justify-center gap-1.5">
                                    {canEdit && (
                                        <Link
                                            href={route("be.users.edit", user.id)}
                                            className="p-1.5 text-slate-400 hover:text-brand-blue-600 hover:bg-brand-blue-50 dark:hover:bg-slate-700 rounded-lg active:scale-95 transition-all cursor-pointer inline-flex items-center"
                                            title="Edit Pengguna"
                                        >
                                            <Edit2 size={15} />
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() => openDeleteModal(user)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg active:scale-95 transition-all cursor-pointer"
                                            title="Hapus Pengguna"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localUsers.data}
                    emptyMessage="Tidak ada pengguna yang cocok dengan filter pencarian."
                />

                {/* Pagination Section */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-3xl text-xs text-slate-500 dark:text-slate-400">
                    {/* Kiri: Info Data */}
                    <p>
                        Menampilkan{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                            {localUsers.from ?? 0}
                        </strong>{" "}
                        sampai{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                            {localUsers.to ?? 0}
                        </strong>{" "}
                        dari{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                            {localUsers.total}
                        </strong>{" "}
                        pengguna
                    </p>

                    {/* Tengah: Per Page Selector */}
                    <div className="flex items-center gap-2">
                        <span>Tampilkan:</span>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 py-1.5 px-2.5 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 font-semibold"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span>per halaman</span>
                    </div>

                    {/* Kanan: Pagination */}
                    <Pagination
                        links={localUsers.links}
                        onPageChange={(url) => {
                            if (!url) return;
                            fetchData(url);
                        }}
                    />
                </div>
            </Card>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={isDeleting}
                title="Hapus Pengguna"
                message={
                    selectedUser ? (
                        <span>
                            Apakah Anda yakin ingin menghapus akun pengguna{" "}
                            <strong>{selectedUser.name}</strong> (@{selectedUser.username})? Semua data akses terkait akun ini akan dihapus secara permanen.
                        </span>
                    ) : (
                        "Apakah Anda yakin ingin menghapus user ini?"
                    )
                }
                confirmText="Ya, Hapus Pengguna"
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </MainLayout>
    );
}
