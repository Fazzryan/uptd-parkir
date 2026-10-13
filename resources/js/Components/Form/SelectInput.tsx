import React, { SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type SelectVariant = "primary" | "success" | "danger" | "warning";

export interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    iconLeft?: ReactNode;
    error?: string;
    children?: ReactNode;
    options?: { value: string | number; label: string }[];
    variant?: SelectVariant;
    containerClassName?: string;
    label?: ReactNode;
    required?: boolean;
}

export default function SelectInput({
    className = "",
    iconLeft,
    error,
    children,
    options,
    variant = "primary",
    containerClassName,
    label,
    required = false,
    ...props
}: SelectInputProps) {
    const focusVariants: Record<SelectVariant, string> = {
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

            {/* Select & Icon Wrapper */}
            <div className="relative w-full">
                {/* Left Icon */}
                {iconLeft && (
                    <div className="absolute left-0 top-0 h-full pl-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                        {iconLeft}
                    </div>
                )}

                <select
                    {...props}
                    required={required}
                    className={
                        `appearance-none py-2 text-sm border bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-xs transition-all duration-200 outline-none w-full ` +
                        (error
                            ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 "
                            : `border-slate-200 dark:border-slate-700 focus:ring-4 ${focusVariants[variant]} `) +
                        (iconLeft ? "pl-11 " : "px-4 ") +
                        "pr-10 " +
                        "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer " +
                        className
                    }
                >
                    {options
                        ? options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                  {opt.label}
                              </option>
                          ))
                        : children}
                </select>

                {/* Custom Chevron Icon */}
                <div className="absolute right-0 top-0 h-full px-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <ChevronDown size={18} />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
}
