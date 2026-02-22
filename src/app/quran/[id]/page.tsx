'use client';

import { useState, useEffect } from 'react';
import { useSurahDetail } from '@/services/quranHooks';
import AyahCard, { stopGlobalAudio } from '@/components/AyahCard';
import Link from 'next/link';
import { useSettingsStore } from '@/lib/stores/useSettingsStore';
import { ChevronLeft, ChevronDown, Check, Play, Pause, ArrowUp } from 'lucide-react';

const QARI_OPTIONS = [
    { id: '01', name: 'Abdullah Al-Juhany' },
    { id: '02', name: 'Muhsin Al-Qasim' },
    { id: '03', name: 'Abdurrahman as-Sudais' },
    { id: '04', name: 'Ibrahim Al-Dossari' },
    { id: '05', name: 'Misyari Rasyid' },
    { id: '06', name: 'Yasser Al-Dosari' },
];

export default function SurahDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const surahId = parseInt(params.id, 10);
    const { data: surah, isLoading, error } = useSurahDetail(surahId);
    const { showLatin, showTranslation, setShowLatin, setShowTranslation, selectedQari, setSelectedQari } =
        useSettingsStore();

    const [autoPlayIndex, setAutoPlayIndex] = useState<number | null>(null);
    const [isQariDropdownOpen, setIsQariDropdownOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlePlaySurah = () => {
        if (autoPlayIndex !== null) {
            stopGlobalAudio();
            setAutoPlayIndex(null);
        } else {
            setAutoPlayIndex(0);
        }
    };

    if (isLoading) {
        return (
            <div className="page-enter space-y-3 px-4 pt-6">
                <div className="skeleton h-32 w-full" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-40 w-full" />
                ))}
            </div>
        );
    }

    if (error || !surah) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-3xl">😔</p>
                    <p className="mt-2 text-sm text-gray-500">Gagal memuat surah</p>
                    <Link href="/quran" className="mt-2 text-sm text-primary-600 hover:underline">
                        ← Kembali
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-enter relative">
            {/* Sticky Header Container */}
            <div className="sticky top-0 z-20 space-y-4 bg-gray-50/95 px-4 pb-4 pt-4 backdrop-blur-md">
                {/* Header & Navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/quran"
                        className="flex w-fit items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-100 transition-colors hover:bg-gray-50 active:scale-95"
                    >
                        <ChevronLeft size={16} />
                        Daftar Surah
                    </Link>

                    {/* Auto Play Button */}
                    <button
                        onClick={handlePlaySurah}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-opacity-90 active:scale-95 ${autoPlayIndex !== null
                            ? 'border border-primary-200 bg-primary-50 text-primary-700'
                            : 'bg-primary-600 text-white'
                            }`}
                    >
                        {autoPlayIndex !== null ? (
                            <>
                                <Pause size={14} /> Jeda
                            </>
                        ) : (
                            <>
                                <Play size={14} /> Putar Surah
                            </>
                        )}
                    </button>
                </div>

                {/* Header Card */}
                <div className="rounded-2xl gradient-primary p-5 text-center text-white shadow-lg">
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="mt-2 text-lg font-bold">{surah.namaLatin}</h1>
                        <p className="font-arabic text-3xl leading-relaxed">{surah.nama}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-sm font-medium">{surah.arti}</p>
                        <p className="text-sm font-medium">|</p>
                        <p className="text-xs font-medium">
                            {surah.tempatTurun} · {surah.jumlahAyat} ayat
                        </p>
                    </div>
                </div>

                {/* Settings */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowLatin(!showLatin)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all btn-press ${showLatin
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                Latin
                            </button>
                            <button
                                onClick={() => setShowTranslation(!showTranslation)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all btn-press ${showTranslation
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                Terjemah
                            </button>
                        </div>
                    </div>

                    {/* Qari Selector - Custom Dropdown */}
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-2 text-sm relative">
                        <span className="pl-2 font-medium text-gray-600">Qari</span>
                        <button
                            onClick={() => setIsQariDropdownOpen(!isQariDropdownOpen)}
                            className="flex items-center gap-2 max-w-[200px] rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-primary-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 focus:ring-2 focus:ring-primary-400"
                        >
                            <span className="truncate">{QARI_OPTIONS.find(q => q.id === selectedQari)?.name || 'Pilih Qari'}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isQariDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isQariDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsQariDropdownOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-52 z-50 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-100">
                                    <div className="flex flex-col py-1 max-h-60 overflow-y-auto">
                                        {QARI_OPTIONS.map((q) => (
                                            <button
                                                key={q.id}
                                                onClick={() => {
                                                    setSelectedQari(q.id);
                                                    setIsQariDropdownOpen(false);
                                                }}
                                                className={`flex flex-row items-center w-full justify-between px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-gray-50 ${selectedQari === q.id ? 'text-primary-600 bg-primary-50' : 'text-gray-600'}`}
                                            >
                                                <span className="truncate">{q.name}</span>
                                                {selectedQari === q.id && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Ayahs */}
            <div className="space-y-3 px-4 mt-2">
                {surah.ayat.map((ayah, index) => (
                    <AyahCard
                        key={ayah.nomorAyat}
                        ayah={ayah}
                        surahId={surah.nomor}
                        surahName={surah.namaLatin}
                        isAutoPlayTarget={autoPlayIndex === index}
                        onAudioPlay={() => setAutoPlayIndex(index)}
                        onManualPlay={() => setAutoPlayIndex(null)}
                        onAudioEnded={() => {
                            if (autoPlayIndex === index) {
                                if (index + 1 < surah.ayat.length) {
                                    setAutoPlayIndex(index + 1);
                                } else {
                                    setAutoPlayIndex(null);
                                }
                            }
                        }}
                    />
                ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4">
                {surah.suratSebelumnya && (
                    <Link
                        href={`/quran/${surah.suratSebelumnya.nomor}`}
                        className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        ← {surah.suratSebelumnya.namaLatin}
                    </Link>
                )}
                <div className="flex-1" />
                {surah.suratSelanjutnya && (
                    <Link
                        href={`/quran/${surah.suratSelanjutnya.nomor}`}
                        className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500"
                    >
                        {surah.suratSelanjutnya.namaLatin} →
                    </Link>
                )}
            </div>

            {/* Back to Top Floating Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-[80px] left-4 z-[51] flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1 hover:bg-primary-500 active:scale-95 ${showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'
                    }`}
                aria-label="Kembali ke atas"
            >
                <ArrowUp size={24} />
            </button>
        </div>
    );
}
