'use client';

import Link from 'next/link';
import { Surah } from '@/types';

interface SurahCardProps {
    surah: Surah;
}

export default function SurahCard({ surah }: SurahCardProps) {
    return (
        <Link
            href={`/quran/${surah.nomor}`}
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary-200"
        >
            {/* Number */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-600">
                {surah.nomor}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {surah.namaLatin}
                </p>
                <p className="text-xs text-gray-400 truncate">
                    {surah.arti} · {surah.jumlahAyat} ayat · {surah.tempatTurun}
                </p>
            </div>

            {/* Arabic name */}
            <p className="flex-shrink-0 text-right font-arabic text-lg text-primary-400">
                {surah.nama}
            </p>
        </Link>
    );
}
