'use client';

import { useState, useMemo } from 'react';
import { useDoa } from '@/services/doaHooks';
import DuaCard from '@/components/DuaCard';

export default function DoaPage() {
    const { data: doaList, isLoading, error } = useDoa();
    const [search, setSearch] = useState('');
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

    // Get unique groups
    const groups = useMemo(() => {
        if (!doaList) return [];
        const unique = Array.from(new Set(doaList.map((d) => d.grup)));
        // const unique = [''];
        return unique.sort();
    }, [doaList]);


    // Filter
    const filteredDoa = useMemo(() => {
        if (!doaList) return [];
        return doaList.filter((d) => {
            const matchSearch =
                !search ||
                d.nama.toLowerCase().includes(search.toLowerCase()) ||
                d.idn.toLowerCase().includes(search.toLowerCase()) ||
                (d.tag && d.tag.some((t) => t.toLowerCase().includes(search.toLowerCase())));
            const matchGroup = !activeGroup || d.grup === activeGroup;
            return matchSearch && matchGroup;
        });
    }, [doaList, search, activeGroup]);

    return (
        <div className="page-enter space-y-4 px-4 pt-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">Doa Harian</h1>
                <p className="text-xs text-gray-400">
                    {doaList ? `${doaList.length} doa pilihan` : 'Memuat...'}
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Cari doa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-10 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 shadow-card transition-all"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </span>
            </div>

            {/* Group Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                    onClick={() => setActiveGroup(null)}
                    className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-all btn-press ${!activeGroup
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    Semua
                </button>
                {groups.map((group) => (
                    <button
                        key={group}
                        onClick={() => setActiveGroup(group === activeGroup ? null : group)}
                        className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-all btn-press ${activeGroup === group
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-500'
                            }`}
                    >
                        {group}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton h-20 w-full" />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-500">
                    Gagal memuat doa. Periksa koneksi internet.
                </div>
            )}

            {/* Doa List */}
            <div className="space-y-2">
                {filteredDoa.map((doa) => (
                    <DuaCard key={doa.id} doa={doa} />
                ))}
                {filteredDoa.length === 0 && !isLoading && (
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-card">
                        <p className="text-3xl">🤲</p>
                        <p className="mt-2 text-sm text-gray-500">Tidak ada doa ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}
