'use client';

import { useState } from 'react';
import { useSurahList } from '@/services/quranHooks';
import { useVectorSearch } from '@/services/vectorHooks';
import SurahCard from '@/components/SurahCard';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import Link from 'next/link';

export default function QuranPage() {
    const { data: surahs, isLoading, error } = useSurahList();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'surah' | 'bookmark'>('surah');
    const [isSmartSearch, setIsSmartSearch] = useState(false);

    // Bookmarks
    const bookmarks = useLiveQuery(() => db.bookmarks.toArray(), []);

    // Vector search
    const { data: vectorResults, isLoading: vectorLoading } = useVectorSearch(
        isSmartSearch ? search : ''
    );

    const filteredSurahs = surahs?.filter(
        (s) =>
            s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
            s.arti.toLowerCase().includes(search.toLowerCase()) ||
            s.nomor.toString() === search
    );

    return (
        <div className="page-enter space-y-4 px-4 pt-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">Al-Quran</h1>
                <p className="text-xs text-gray-400">Baca dan dengarkan Al-Quran</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('surah')}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all btn-press ${activeTab === 'surah'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                >
                    📖 Surah
                </button>
                <button
                    onClick={() => setActiveTab('bookmark')}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all btn-press ${activeTab === 'bookmark'
                        ? 'bg-accent-100 text-accent-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                >
                    🔖 Bookmark ({bookmarks?.length || 0})
                </button>
            </div>

            {activeTab === 'surah' && (
                <>
                    {/* Search */}
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={isSmartSearch ? 'Cari dengan AI...' : 'Cari surah...'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-10 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 shadow-card transition-all"
                            />
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                        </div>
                        {/* Smart search toggle */}
                        <button
                            onClick={() => setIsSmartSearch(!isSmartSearch)}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all btn-press ${isSmartSearch
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            🔮 Cari Cerdas (AI)
                        </button>
                    </div>

                    {/* Vector Search Results */}
                    {isSmartSearch && search.length > 2 && (
                        <div className="space-y-2">
                            {vectorLoading && (
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="skeleton h-24 w-full" />
                                    ))}
                                </div>
                            )}
                            {vectorResults && vectorResults.hasil.length > 0 && (
                                <>
                                    <p className="text-xs font-medium text-gray-400">
                                        {vectorResults.jumlah} hasil ditemukan
                                    </p>
                                    {vectorResults.hasil.map((result, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card"
                                        >
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${result.relevansi === 'tinggi'
                                                    ? 'bg-primary-100 text-primary-700'
                                                    : result.relevansi === 'sedang'
                                                        ? 'bg-accent-100 text-accent-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {result.tipe}
                                                </span>
                                                {result.data.nama_surat && (
                                                    <Link
                                                        href={`/quran/${result.data.id_surat}`}
                                                        className="text-xs text-primary-600 hover:underline"
                                                    >
                                                        {result.data.nama_surat}
                                                        {result.data.nomor_ayat ? ` : ${result.data.nomor_ayat}` : ''}
                                                    </Link>
                                                )}
                                            </div>
                                            {result.data.teks_arab && (
                                                <p className="mb-2 text-right font-arabic text-lg leading-relaxed text-gray-900">
                                                    {result.data.teks_arab}
                                                </p>
                                            )}{result.data.teks_latin && (
                                                <p className="mb-2 text-sm italic leading-relaxed text-primary-600/70">
                                                    {result.data.teks_latin}
                                                </p>
                                            )}
                                            {result.data.terjemahan_id && (
                                                <p className="text-xs text-gray-500">{result.data.terjemahan_id}</p>
                                            )}
                                            {result.data.isi && (
                                                <p className="text-xs text-gray-500 line-clamp-3">{result.data.isi}</p>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                            {vectorResults && vectorResults.hasil.length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4">
                                    Tidak ada hasil ditemukan
                                </p>
                            )}
                        </div>
                    )}

                    {/* Regular Surah List (show when not smart searching) */}
                    {(!isSmartSearch || search.length <= 2) && (
                        <>
                            {isLoading && (
                                <div className="space-y-2">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="skeleton h-16 w-full" />
                                    ))}
                                </div>
                            )}

                            {error && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-500">
                                    Gagal memuat data. Periksa koneksi internet.
                                </div>
                            )}

                            {filteredSurahs && (
                                <div className="space-y-2">
                                    {filteredSurahs.map((surah) => (
                                        <SurahCard key={surah.nomor} surah={surah} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {activeTab === 'bookmark' && (
                <div className="space-y-2">
                    {(!bookmarks || bookmarks.length === 0) && (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-card">
                            <p className="text-3xl">📌</p>
                            <p className="mt-2 text-sm text-gray-500">Belum ada bookmark</p>
                            <p className="text-xs text-gray-400">
                                Buka surah dan simpan ayat favoritmu
                            </p>
                        </div>
                    )}
                    {bookmarks?.map((bm) => (
                        <Link
                            key={bm.id}
                            href={`/quran/${bm.surahId}`}
                            className="block rounded-2xl border border-accent-100 bg-white p-4 shadow-card transition-all hover:shadow-card-hover"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm font-medium text-accent-500">
                                    {bm.surahName} : {bm.ayahNumber}
                                </p>
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        await db.bookmarks.delete(bm.id!);
                                    }}
                                    className="text-xs text-gray-400 hover:text-red-500"
                                >
                                    Hapus
                                </button>
                            </div>
                            <p className="mb-2 text-right font-arabic text-lg leading-relaxed text-gray-900">
                                {bm.teksArab}
                            </p>
                            <p className="text-xs text-gray-500">{bm.teksIndonesia}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
