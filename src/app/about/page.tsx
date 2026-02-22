'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Info, Heart, ExternalLink, TriangleAlert } from 'lucide-react';
import { db } from '@/lib/db';
import toast from 'react-hot-toast';

export default function AboutPage() {
    const pathname = usePathname();

    // Auto-dismiss any open toasts (especially the Danger Zone confirmation)
    // when the user navigates away from this page
    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, [pathname]);

    return (
        <div className="page-enter space-y-6 px-4 py-6">
            {/* Header */}
            <div className="flex items-center">
                <Link
                    href="/"
                    className="flex w-fit items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-100 transition-colors hover:bg-gray-50 active:scale-95"
                >
                    <ChevronLeft size={16} />
                    Kembali
                </Link>
            </div>

            {/* App Info Card */}
            <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-6 shadow-card text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary-100 mb-4">
                    <Image
                        src="/kareem-logo.png"
                        alt="Kareem App Logo"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        priority
                    />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Kareem</h1>
                <p className="text-sm font-medium text-primary-600 mb-4">Versi 1.0.0 (MVP)</p>

                <p className="text-sm text-gray-600 leading-relaxed text-left">
                    Aplikasi pelacak ibadah harian Ramadan moderen yang berfokus pada pengalaman pengguna yang mulus. Dilengkapi dengan sistem XP harian, rangkaian rekor rekam jejak (streak), Jadwal Imsakiyah dan Al-Quran *Auto-Play*.
                </p>

                <div className="mt-4 rounded-xl bg-orange-50 p-3 text-left border border-orange-100">
                    <p className="text-xs text-orange-800 flex items-start gap-2">
                        <Info size={14} className="mt-0.5 shrink-0" />
                        <span>Saat ini antarmuka aplikasi Kareem dirancang khusus hanya untuk mendukung <strong>Bahasa Indonesia</strong>.</span>
                    </p>
                </div>
            </div>

            {/* Attribution Section */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card space-y-4">
                <div className="flex items-center gap-2 text-gray-800">
                    <Heart size={18} className="text-red-500" />
                    <h2 className="font-bold">Sumber API &amp; Atribusi</h2>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                    Aplikasi ini dibangun untuk kemudahan umat dan merupakan proyek nirlaba (non-profit). Kami berterima kasih kepada penyedia layanan data terbuka (Public API) yang memungkinkan aplikasi ini berjalan dengan sangat leluasa.
                </p>

                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        EQuran.id
                        <a href="https://equran.id" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                            <ExternalLink size={12} />
                        </a>
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                        Seluruh teks ayat Al-Quran, terjemahan, tafsir ringkas (Kemenag), dan lafal audio lantunan Qari disediakan sepenuhnya oleh API publik EQuran.id.
                    </p>
                    <a
                        href="https://equran.id/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-[10px] font-medium text-primary-600 hover:underline"
                    >
                        Baca Syarat & Ketentuan EQuran
                    </a>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 mt-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        Imsakiyah (Kemenag API)
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                        Data jadwal historis Imsakiyah & Shalat lima waktu di seluruh kabupaten/kota Indonesia bersumber dari *API Imsakiyah* EQuran.id.
                    </p>
                </div>
            </div>
            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-red-700">
                    <TriangleAlert size={18} />
                    <h2 className="font-bold text-sm">Reset Data</h2>
                </div>
                <p className="text-xs text-red-600/80 leading-relaxed">
                    Menghapus data akan me-reset seluruh rekam jejak ibadah, titik XP harian, rekor *streak*, serta pengaturan lokasi jadwal Imsakiyah Anda. Tindakan ini tidak dapat dibatalkan.
                </p>
                <button
                    onClick={() => {
                        toast((t) => (
                            <div className="flex flex-col gap-3 p-2">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-red-100 p-2 text-red-600 shrink-0">
                                        <TriangleAlert size={20} />
                                    </div>
                                    <div className="text-sm font-medium text-gray-800 leading-snug">
                                        Yakin ingin menghapus SELURUH data ibadah dan memulai dari nol?
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toast.dismiss(t.id)}
                                        className="flex-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={async () => {
                                            toast.dismiss(t.id);
                                            try {
                                                await db.delete();
                                                localStorage.clear();
                                                window.location.href = '/';
                                            } catch {
                                                toast.error('Gagal menghapus data.');
                                            }
                                        }}
                                        className="flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                                    >
                                        Ya, Hapus
                                    </button>
                                </div>
                            </div>
                        ), {
                            duration: Infinity,
                            style: { background: '#ffffff', color: '#1f2937' }
                        });
                    }}
                    className="w-full rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-200 active:scale-95"
                >
                    Hapus Data & Mulai Ulang
                </button>
            </div>
        </div>
    );
}
