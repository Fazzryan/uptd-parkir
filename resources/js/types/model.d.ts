export interface Jukir {
    id: number;
    kode_jukir?: string;
    user_id?: number;
    wilayah_parkir_id?: number | string;
    nama: string;
    nohp?: string;
    alamat?: string;
    foto?: string;
    status: string;
    user?: User;
    wilayah_parkir?: WilayahParkir;
    wilayahParkir?: WilayahParkir;
    targets?: JukirTarget[];
    setoran_harian?: JukirSetorHarian[];
    setoranHarian?: JukirSetorHarian[];
    created_at?: string;
    updated_at?: string;
}

export interface JukirTarget {
    id: number;
    jukir_id: number;
    tahun: number;
    bulan: number;
    nama_bulan?: string;
    jml_hari: number;
    target_per_hari: number | string;
    total_target: number | string;
    keterangan?: string | null;
    jukir?: Jukir;
    created_at?: string;
    updated_at?: string;
}

export interface JukirSetorHarian {
    id: number;
    jukir_id: number;
    petugas_id?: number | null;
    kode_transaksi: string;
    external_id?: string | null;
    tanggal: string;
    jam?: string | null;
    nominal_setor: number | string;
    metode_pembayaran: "Tunai" | "QRIS" | string;
    status: "Pending" | "Success" | "Failed" | string;
    bukti_setor?: string | null;
    keterangan?: string | null;
    payload_response?: Record<string, any> | null;
    jukir?: Jukir;
    petugas?: User;
    created_at?: string;
    updated_at?: string;
}


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
    jenis_kendaraan?: string;
    kategori_kendaraan?: string;
    tarif?: number;
    nominal_tarif?: number;
    keterangan?: string;
    contoh_karcis?: string;
    foto?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PanduanJukir {
    id: number;
    judul?: string;
    foto?: string;
    deskripsi?: string;
    teks_info?: string;
    urutan?: number;
    created_at?: string;
    updated_at?: string;
}

export interface GaleriFotoItem {
    id: number;
    galeri_foto_id?: number;
    foto: string;
    created_at?: string;
    updated_at?: string;
}

export interface GaleriFoto {
    id: number;
    kategori: string;
    caption: string;
    tanggal: string;
    foto?: string;
    fotos?: string[];
    items?: GaleriFotoItem[];
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
    app_name?: string;
    app_logo?: string | null;
    primary_color?: string;
    wa_number?: string;
    wa_message?: string;
    teks_hak_pengguna_parkir?: string;
    [key: string]: any;
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
