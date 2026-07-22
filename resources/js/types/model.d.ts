export interface StrukturOrganisasiPersonel {
    id: number;
    nama: string;
    nip: string;
    jabatan: string;
    foto: string;
    created_at?: string;
    updated_at?: string;
}

export interface WilayahParkir {
    id: number;
    kecamatan_id?: number | string;
    nama_jalan: string;
    latitude: string;
    longitude: string;
    kecamatan?: Kecamatan;
    created_at?: string;
    updated_at?: string;
}

export interface Kecamatan {
    id: number;
    id_kecamatan?: string;
    nama_kecamatan: string;
    latitude?: string;
    longitude?: string;
    alamat?: string;
    created_at?: string;
    updated_at?: string;
}
export interface TarifParkirKarcis {
    id: number;
    kategori_kendaraan: string;
    nominal_tarif: number;
    keterangan?: string;
    foto?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PanduanJukir {
    id: number;
    foto: string;
    deskripsi: string;
    teks_info: string;
    created_at?: string;
    updated_at?: string;
}

export interface GaleriFoto {
    id: number;
    kategori: string;
    caption: string;
    tanggal: string;
    foto?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Berita {
    id: number;
    judul: string;
    slug?: string;
    kategori: string;
    tanggal: string;
    ringkasan?: string;
    isi?: string;
    foto?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Permission {
    id: number;
    name: string;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name?: string;
    permissions?: Permission[];
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at?: string;
    roles: Role[] | string[];
    permissions?: string[];
    profile_photo_path?: string;
    created_at?: string;
    updated_at?: string;
}

// ... existing code ...
export interface AppSettings {
    app_name: string;
    app_logo: string | null;
    primary_color: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
}

export interface SharedProps {
    auth: {
        user: User;
    };
    app_settings?: AppSettings;
    flash: {
        success?: string;
        error?: string;
        message?: string;
    };
    errors: Record<string, string>;
    [key: string]: unknown;
}
