import React, { TextareaHTMLAttributes, ReactNode } from "react";

type InputVariant = "primary" | "success" | "danger" | "warning";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: ReactNode;
    required?: boolean;
    error?: string;
    containerClassName?: string;
    variant?: InputVariant;
}

export default function TextArea({
    label,
    required = false,
    className = "",
    error,
    containerClassName,
    variant = "primary",
    ...props
}: TextAreaProps) {
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

            <textarea
                {...props}
                required={required}
                className={
                    `py-2.5 border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm rounded-xl shadow-xs transition-all duration-200 outline-none w-full ` +
                    (error
                        ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 "
                        : `border-slate-200 dark:border-slate-700 focus:ring-4 ${focusVariants[variant]} `) +
                    "px-4 " +
                    className
                }
            />

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
}
