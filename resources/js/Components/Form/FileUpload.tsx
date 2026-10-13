import React, { useRef, useState, useEffect, ReactNode, DragEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export interface FileUploadProps {
    label?: ReactNode;
    required?: boolean;
    error?: string;
    value?: File | null;
    previewUrl?: string | null;
    initialPreview?: string | null;
    onChange?: (file: File | null) => void;
    onRemove?: () => void;
    accept?: string;
    maxSizeMB?: number;
    title?: string;
    subtitle?: string;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    previewImageClassName?: string;
    aspectRatio?: "square" | "video" | "auto";
}

export default function FileUpload({
    label,
    required = false,
    error,
    value,
    previewUrl: externalPreviewUrl,
    initialPreview,
    onChange,
    onRemove,
    accept = "image/png,image/jpeg,image/jpg,image/webp",
    maxSizeMB = 2,
    title = "Klik atau seret file ke sini untuk mengunggah",
    subtitle,
    disabled = false,
    className = "",
    containerClassName = "space-y-2",
    previewImageClassName,
    aspectRatio = "square",
}: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [internalPreview, setInternalPreview] = useState<string | null>(
        initialPreview || null,
    );
    const [isDragging, setIsDragging] = useState(false);

    // Default subtitle jika tidak dioper
    const defaultSubtitle =
        subtitle || `PNG, JPG, JPEG, atau WEBP (Maksimal ${maxSizeMB}MB)`;

    // Tentukan URL preview aktif (utamakan external previewUrl jika dikontrol dari luar)
    const activePreview =
        externalPreviewUrl !== undefined ? externalPreviewUrl : internalPreview;

    // Sinkronisasi internal preview jika initialPreview berubah
    useEffect(() => {
        if (initialPreview && !value && externalPreviewUrl === undefined) {
            setInternalPreview(initialPreview);
        }
    }, [initialPreview]);

    // Sinkronisasi internal preview jika value (File) berubah dari luar
    useEffect(() => {
        if (externalPreviewUrl !== undefined) return;

        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setInternalPreview(objectUrl);
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else if (value === null) {
            setInternalPreview(initialPreview || null);
        }
    }, [value, externalPreviewUrl, initialPreview]);

    const handleSelectFile = (file: File | null) => {
        if (!file) return;

        // Validasi ukuran file (opsional feedback jika melebihi batas)
        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
            // Tetap teruskan ke onChange agar penanganan error validasi dapat dilakukan
            // oleh form Laravel / Inertia, namun komponen siap menangani
        }

        if (externalPreviewUrl === undefined) {
            const objectUrl = URL.createObjectURL(file);
            setInternalPreview(objectUrl);
        }

        onChange?.(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleSelectFile(file);
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (externalPreviewUrl === undefined) {
            setInternalPreview(null);
        }
        onChange?.(null);
        onRemove?.();
    };

    // Drag and Drop Handler
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const file = e.dataTransfer.files?.[0] || null;
        if (file) {
            handleSelectFile(file);
        }
    };

    // Styling preview gambar berdasarkan aspek rasio
    const getPreviewClass = () => {
        if (previewImageClassName) return previewImageClassName;
        switch (aspectRatio) {
            case "video":
                return "w-full max-w-md h-52 object-cover";
            case "auto":
                return "max-h-64 w-auto object-contain";
            case "square":
            default:
                return "h-44 w-44 object-cover";
        }
    };

    return (
        <div className={containerClassName}>
            {/* Label Form */}
            {label && (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}

            {/* Hidden Input File */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                disabled={disabled}
                className="hidden"
            />

            {/* Tampilan Area Upload / Preview */}
            {activePreview ? (
                <div className="relative inline-block rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 shadow-xs">
                    <img
                        src={activePreview}
                        alt="Preview Foto"
                        className={getPreviewClass()}
                    />

                    {/* Tombol Hapus / Reset Foto */}
                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 p-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all active:scale-95 cursor-pointer"
                            title="Hapus foto"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {/* Footer Tombol Ganti Foto */}
                    {!disabled && (
                        <div className="p-2 text-center bg-white/95 backdrop-blur-xs dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs font-bold text-brand-blue-600 hover:text-brand-blue-700 dark:text-brand-blue-400 transition-colors active:scale-95 cursor-pointer"
                            >
                                Ganti Foto
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 group bg-slate-50/50 hover:bg-brand-blue-50/30 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 ${
                        disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                    } ${
                        error
                            ? "border-rose-400 bg-rose-50/30 dark:bg-rose-950/10"
                            : isDragging
                              ? "border-brand-blue-500 bg-brand-blue-50/50 dark:bg-slate-800"
                              : "border-slate-200 hover:border-brand-blue-400 dark:border-slate-700"
                    } ${className}`}
                >
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-brand-blue-600 group-hover:border-brand-blue-200 transition-colors dark:bg-slate-800 dark:border-slate-700 shadow-xs">
                        <Upload size={24} />
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-blue-600 transition-colors text-center">
                        {title}
                    </p>
                    {defaultSubtitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center">
                            {defaultSubtitle}
                        </p>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1.5 ml-1 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
}