'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { getRamadanDate, getHariName, formatDateId } from '@/lib/ramadan';
import { toLocalISODate } from '@/lib/constants';
import toast from 'react-hot-toast';

interface RamadanHeatmapProps {
    hijriah: string;
    todayTanggal: number;
}

export default function RamadanHeatmap({ hijriah, todayTanggal }: RamadanHeatmapProps) {
    const router = useRouter();
    const [selectedPastDay, setSelectedPastDay] = useState<number | null>(null);

    // Load all habit logs grouped by date
    const logsByDate = useLiveQuery(async () => {
        const logs = await db.habitLogs.toArray();
        const completed = logs.filter((l) => l.completed);
        const grouped: Record<string, number> = {};
        completed.forEach((log) => {
            grouped[log.date] = (grouped[log.date] || 0) + 1;
        });
        return grouped;
    }, []);

    // Generate 30 Ramadan days
    const days = Array.from({ length: 30 }, (_, i) => {
        const tanggal = i + 1;
        const date = getRamadanDate(hijriah, tanggal);
        const dateStr = toLocalISODate(date);
        const count = logsByDate?.[dateStr] || 0;
        const isToday = tanggal === todayTanggal;
        const isPast = tanggal < todayTanggal;
        const isFuture = tanggal > todayTanggal;
        return { tanggal, date, dateStr, count, isToday, isPast, isFuture };
    });

    // Color intensity based on count
    const getColor = (count: number, isToday: boolean, isFuture: boolean) => {
        if (isFuture) return 'bg-gray-100';
        if (count === 0) return isToday ? 'bg-gray-200 ring-2 ring-primary-400 ring-offset-1' : 'bg-gray-200';
        if (count <= 3) return isToday ? 'bg-primary-200 ring-2 ring-primary-400 ring-offset-1' : 'bg-primary-200';
        if (count <= 6) return isToday ? 'bg-primary-300 ring-2 ring-primary-400 ring-offset-1' : 'bg-primary-300';
        if (count <= 9) return isToday ? 'bg-primary-400 ring-2 ring-primary-500 ring-offset-1' : 'bg-primary-400';
        return isToday ? 'bg-primary-600 ring-2 ring-primary-700 ring-offset-1' : 'bg-primary-600';
    };

    const handleDayClick = (day: typeof days[0]) => {
        if (day.isFuture) {
            toast('Belum saatnya untuk mengisi! InsyaAllah segera tiba.', { icon: '⏳' });
        } else if (day.isToday) {
            router.push('/tracker');
        } else if (day.isPast) {
            setSelectedPastDay(day.tanggal);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">🌙 30 Hari Ramadhan</h3>
                <div className="flex items-center gap-1 text-[9px] text-gray-400">
                    <span>Sedikit</span>
                    <div className="h-2.5 w-2.5 rounded-sm bg-gray-200" />
                    <div className="h-2.5 w-2.5 rounded-sm bg-primary-200" />
                    <div className="h-2.5 w-2.5 rounded-sm bg-primary-400" />
                    <div className="h-2.5 w-2.5 rounded-sm bg-primary-600" />
                    <span>Banyak</span>
                </div>
            </div>

            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[10px] font-medium text-gray-400">
                <div>Sen</div>
                <div>Sel</div>
                <div>Rab</div>
                <div>Kam</div>
                <div>Jum</div>
                <div>Sab</div>
                <div>Min</div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
                {/* Empty blocks for days before 1 Ramadhan */}
                {days.length > 0 && Array.from({ length: (days[0].date.getDay() + 6) % 7 }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square w-full rounded-md bg-transparent" />
                ))}

                {days.map((day) => {
                    const colorClass = getColor(day.count, day.isToday, day.isFuture);
                    return (
                        <button
                            key={day.tanggal}
                            onClick={() => handleDayClick(day)}
                            className="group relative cursor-pointer outline-none"
                        >
                            <div
                                className={`aspect-square w-full rounded-md transition-all duration-300 ${colorClass} ${day.isToday ? 'scale-110' : 'hover:scale-105'}`}
                            ></div>
                            <span className={`absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium ${day.isToday ? 'text-white font-bold' : (day.count > 6 ? 'text-white' : 'text-gray-500')}`}>
                                {day.tanggal}
                            </span>

                            {/* Tooltip */}
                            <div className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-gray-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap shadow-lg">
                                <p className="font-medium">{day.tanggal} Ramadhan</p>
                                <p>{getHariName(day.date)}, {formatDateId(day.date)}</p>
                                <p>{day.isFuture ? 'Belum tiba, InsyaAllah' : `${day.count} ibadah ✓`}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Past Day Confirmation Modal */}
            {selectedPastDay !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-xl">
                                🕰️
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Melihat Masa Lalu</h3>
                                <p className="text-xs text-gray-500">Hari ke-{selectedPastDay} Ramadhan</p>
                            </div>
                        </div>
                        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
                            Apakah kamu ingin memeriksa atau mengisi daftar ibadah yang terlewat pada hari ke-{selectedPastDay}?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedPastDay(null)}
                                className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    router.push(`/tracker?day=${selectedPastDay}`);
                                    setSelectedPastDay(null);
                                }}
                                className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:scale-95 shadow-md shadow-primary-500/30"
                            >
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
