import React from "react";
import { Head, useForm } from "@inertiajs/react";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { User, Lock, AlertCircle } from "lucide-react";
import Card from "@/Components/UI/Card";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors duration-300">
            <Head title="Masuk" />

            {/* Login Card */}
            <Card className="w-full max-w-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 overflow-hidden transform transition-all duration-300 hover:shadow-2xl dark:shadow-slate-900/50">
                {/* Decorative Top Bar */}
                <div className="p-8">
                    {/* Header Branding */}
                    <div className="mb-8 text-center flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center">
                            {/* Logo Placeholder with fallback to Shield Icon */}
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo Kab. Tasikmalaya"
                                className="w-full h-full object-contain drop-shadow-md"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.nextElementSibling?.classList.remove(
                                        "hidden",
                                    );
                                }}
                            />
                        </div>
                        <h2 className="font-bold uppercase tracking-widest text-brand-blue-700 dark:text-blue-500 mb-1">
                            UPTD PARKIR
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">
                            Pemerintah Kabupaten Tasikmalaya
                        </p>
                    </div>

                    {/* General Error Alert */}
                    {(errors.username || errors.password) && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-300">
                            <AlertCircle
                                size={18}
                                className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400"
                            />
                            <div className="font-medium">
                                {errors.username || errors.password}
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Username
                                </label>
                                <TextInput
                                    type="text"
                                    placeholder="Masukkan username"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    iconLeft={<User size={18} />}
                                    autoFocus
                                    error={errors.username}
                                    containerClassName="relative w-full"
                                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                    Password
                                </label>
                                <TextInput
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    iconLeft={<Lock size={18} />}
                                    error={errors.password}
                                    containerClassName="relative w-full"
                                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                                className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 ring-blue-100 dark:ring-blue-900 !py-3 !rounded-xl shadow-lg shadow-blue-800/20 dark:shadow-none active:scale-95 space-x-2 mt-2 font-semibold tracking-wide"
                            >
                                {processing ? "Memproses..." : "Masuk"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                &copy; {new Date().getFullYear()} Dinas Perhubungan Komunikasi
                dan Informatika
                <br />
                Kabupaten Tasikmalaya
            </div>
        </div>
    );
}
