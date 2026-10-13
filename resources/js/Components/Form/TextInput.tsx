import React, { InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputVariant = "primary" | "success" | "danger" | "warning";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    error?: string;
    containerClassName?: string;
    variant?: InputVariant;
    label?: ReactNode;
    required?: boolean;
}

export default function TextInput({
    type = "text",
    className = "",
    iconLeft,
    iconRight,
    error,
    containerClassName,
    variant = "primary",
    label,
    required = false,
    ...props
}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Tentukan tipe input akhir (kalau password, bisa berubah jadi text)
    const inputType = type === "password" && showPassword ? "text" : type;

    const focusVariants: Record<InputVariant, string> = {
        primary: "focus:border-brand-blue-500 focus:ring-brand-blue-500/10",
        success: "focus:border-brand-green-500 focus:ring-brand-green-500/10",
        danger: "focus:border-rose-500 focus:ring-rose-500/10",
        warning: "focus:border-yellow-500 focus:ring-yellow-500/10",
    };

    // Render label otomatis (mendukung string dengan tanda '*' di ujung atau via prop required)
    const renderLabel = () => {
        if (!label) return null;

        if (typeof label === "string" && label.trim().endsWith("*")) {
            const textWithoutStar = label.trim().slice(0, -1).trim();
            return (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    {textWithoutStar} <span className="text-rose-500 ml-0.5">*</span>
                </label>
            );
        }

        return (
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {label}
                {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
        );
    };

    const defaultContainerClass = label ? "w-full" : "relative w-full mt-2";
    const finalContainerClass = containerClassName ?? defaultContainerClass;

    return (
        <div className={finalContainerClass}>
            {/* Form Label */}
            {renderLabel()}

            {/* Input & Icon Wrapper */}
            <div className="relative w-full">
                {/* Left Icon */}
                {iconLeft && (
                    <div className="absolute left-0 top-0 h-full pl-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                        {iconLeft}
                    </div>
                )}

                <input
                    {...props}
                    type={inputType}
                    required={required}
                    className={
                        `py-2 border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-xs transition-all duration-200 outline-none w-full ` +
                        (error
                            ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 "
                            : `border-slate-200 dark:border-slate-700 focus:ring-4 ${focusVariants[variant]} `) +
                        (iconLeft ? "pl-11 " : "px-4 ") +
                        (type === "password" || iconRight ? "pr-11 " : "") +
                        className
                    }
                />

                {/* Right Icon (Prioritize Password Toggle if Type is Password) */}
                {type === "password" ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-brand-blue-600 transition-colors flex items-center cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                ) : iconRight ? (
                    <div className="absolute right-0 top-0 h-full pr-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                        {iconRight}
                    </div>
                ) : null}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
}
