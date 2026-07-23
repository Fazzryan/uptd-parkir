import React, { useRef, useEffect } from "react";
import {
    Bold,
    Link as LinkIcon,
    RemoveFormatting,
    Undo,
    Redo,
} from "lucide-react";

interface RichTextEditorProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({
    label,
    value,
    onChange,
    error,
    placeholder = "Tuliskan isi berita di sini...",
    className = "",
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);

    // Synchronize external value into contentEditable element without losing cursor focus
    useEffect(() => {
        if (editorRef.current) {
            if (isInternalChange.current) {
                isInternalChange.current = false;
                return;
            }
            if (editorRef.current.innerHTML !== (value || "")) {
                editorRef.current.innerHTML = value || "";
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            isInternalChange.current = true;
            const html = editorRef.current.innerHTML;
            onChange(html === "<br>" ? "" : html);
        }
    };

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleAddLink = () => {
        const url = prompt("Masukkan URL Link (contoh: https://example.com):");
        if (url) {
            execCmd("createLink", url);
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}

            <div
                className={`overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 transition-all ${
                    error
                        ? "border-rose-400 dark:border-rose-500/80"
                        : "border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
                }`}
            >
                {/* Toolbar Sederhana: Bold, Link, RemoveFormatting, Undo/Redo */}
                <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-2 text-slate-700 dark:text-slate-300">
                    <button
                        type="button"
                        onClick={() => execCmd("bold")}
                        className="rounded-lg p-1.5 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 flex items-center gap-1 text-xs font-bold"
                        title="Tebal (Ctrl+B)"
                    >
                        <Bold size={16} />
                        <span>Tebal</span>
                    </button>

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                    <button
                        type="button"
                        onClick={handleAddLink}
                        className="rounded-lg p-1.5 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 flex items-center gap-1 text-xs font-medium"
                        title="Sisipkan Link"
                    >
                        <LinkIcon size={16} />
                        <span>Link</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => execCmd("removeFormat")}
                        className="rounded-lg p-1.5 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
                        title="Hapus Format Teks"
                    >
                        <RemoveFormatting size={16} />
                    </button>

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 ml-auto" />

                    <button
                        type="button"
                        onClick={() => execCmd("undo")}
                        className="rounded-lg p-1.5 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => execCmd("redo")}
                        className="rounded-lg p-1.5 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo size={16} />
                    </button>
                </div>

                {/* ContentEditable Area */}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    data-placeholder={placeholder}
                    className="min-h-[160px] max-h-[350px] overflow-y-auto p-4 text-sm text-slate-800 dark:text-slate-200 outline-none leading-relaxed prose prose-slate max-w-none dark:prose-invert focus:outline-none whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 dark:empty:before:text-slate-500 empty:before:pointer-events-none"
                />
            </div>

            {error && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>
            )}
        </div>
    );
}
