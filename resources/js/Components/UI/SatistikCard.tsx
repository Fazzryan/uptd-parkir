// resources/js/Components/StatCard.tsx
import React, { ElementType } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ElementType;
    color: string;
    textColor?: string;
    description?: string;
    className?: string;
    period?: string;
    valueClassName?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    textColor,
    description,
    className = "",
    period = "Tahun 2025",
    valueClassName = "text-xl lg:text-2xl",
}: StatCardProps) {
    return (
        <div
            className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow dark:bg-slate-800 dark:shadow-slate-700/50 ${className}`}
        >
            <div className="flex items-center justify-between mb-3">
                {/* Background kotak menggunakan warna solid, icon menggunakan text-white */}
                <div
                    className={`p-2.5 rounded-xl ${color} shadow-lg transition-transform group-hover:scale-110`}
                >
                    <Icon size={20} strokeWidth={2} className="text-white" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500">
                    {period}
                </span>
            </div>
            <div>
                <h3 className="text-slate-500 text-xs sm:text-sm font-medium dark:text-slate-400">
                    {title}
                </h3>
                <div className="flex flex-col mt-1">
                    <span
                        className={`font-bold text-slate-800 dark:text-slate-200 tracking-tight whitespace-nowrap ${valueClassName}`}
                    >
                        {value}
                    </span>
                    {description && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 truncate">
                            {description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
