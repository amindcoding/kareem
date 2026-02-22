'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { calculateTotalXP, getLevelFromXP } from '@/lib/xp';
import { LEVELS, toLocalISODate, getToday, parseLocalDate } from '@/lib/constants';
import { calculateStreak } from '@/lib/streak';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ProgressPage() {
    const [totalXP, setTotalXP] = useState(0);
    const [streak, setStreak] = useState({ current: 0, longest: 0, lastActiveDate: null as string | null });

    useEffect(() => {
        calculateTotalXP().then(setTotalXP);
        calculateStreak().then(setStreak);
    }, []);

    const level = getLevelFromXP(totalXP);

    // Get recent activity (last 7 days)
    const recentLogs = useLiveQuery(async () => {
        const logs = await db.habitLogs.toArray();
        const completed = logs.filter((l) => l.completed);
        const grouped: Record<string, number> = {};
        completed.forEach((log) => {
            grouped[log.date] = (grouped[log.date] || 0) + 1;
        });
        return grouped;
    }, []);

    // Generate 7 days starting from Thursday (Start of Ramadan)
    // Thursday is getDay() === 4
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        // Calculate days since last Thursday
        const currentDay = d.getDay();
        const diffToThursday = currentDay >= 4 ? currentDay - 4 : currentDay + 3;

        // Go back to the most recent Thursday, then add `i` days
        d.setDate(d.getDate() - diffToThursday + i);
        return toLocalISODate(d);
    });

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return (
        <div className="page-enter space-y-5 px-4 pt-6">
            {/* Header & Navigation */}
            <div className="flex justify-between items-start gap-3">
                <Link
                    href="/"
                    className="flex w-fit items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-100 transition-colors hover:bg-gray-50 active:scale-95"
                >
                    <ChevronLeft size={16} />
                    Beranda
                </Link>
                <div className="text-right">
                    <h1 className="text-xl font-bold text-gray-900">Progres</h1>
                    <p className="text-xs text-gray-400">Pantau perkembangan ibadahmu</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-4 shadow-card">
                    <p className="text-2xl font-bold text-primary-600">{totalXP}</p>
                    <p className="text-xs font-medium text-gray-500">Total XP</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
                    <p className="text-2xl font-bold text-gray-800">
                        {level.emoji} Lv.{level.level}
                    </p>
                    <p className="text-xs font-medium text-gray-500">{level.name}</p>
                </div>
                <div className="rounded-2xl border border-accent-100 bg-accent-50 p-4 shadow-card">
                    <p className="text-2xl font-bold text-accent-500">{streak.current} 🔥</p>
                    <p className="text-xs font-medium text-gray-500">Streak</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
                    <p className="text-2xl font-bold text-gray-800">{streak.longest} ⭐</p>
                    <p className="text-xs font-medium text-gray-500">Terpanjang</p>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-800">Aktivitas 7 Hari Terakhir</h2>

                    {/* Week of Ramadan Legend */}
                    {(() => {
                        if (last7Days.length > 0) {
                            const firstDayOfChart = parseLocalDate(last7Days[0]);
                            const firstDayOfRamadan = new Date('2026-02-19T00:00:00'); // Kamis, 1 Ramadhan

                            // Calculate days difference
                            const diffTime = firstDayOfChart.getTime() - firstDayOfRamadan.getTime();
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                            // Calculate week number (1-indexed)
                            // Even if it's negative (before ramadan), we just show "Prapuasa" or week 1
                            const weekNum = Math.floor(diffDays / 7) + 1;

                            return (
                                <div className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-semibold text-primary-600 border border-primary-100">
                                    {weekNum > 0 && weekNum <= 5 ? `Pekan ke-${weekNum} Ramadhan` : 'Prapuasa'}
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>

                <div className="flex items-end justify-between gap-2 border-t border-gray-50 pt-3 relative">
                    {/* Underlying guide line for the week */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-200 w-full opacity-50"></div>
                    </div>

                    {last7Days.map((date) => {
                        const count = recentLogs?.[date] || 0;
                        const maxH = 80;
                        const h = count > 0 ? Math.max(20, Math.min(count * 16, maxH)) : 8;
                        const dayOfWeek = parseLocalDate(date).getDay();
                        const todayStr = getToday();
                        const isToday = date === todayStr;
                        const isFuture = date > todayStr;

                        return (
                            <div key={date} className="flex flex-1 flex-col items-center gap-1 z-10 w-full pt-1">
                                <span className={`text-[10px] font-medium ${isFuture ? 'text-transparent' : 'text-gray-400'}`}>
                                    {isFuture ? '-' : count}
                                </span>
                                {/* Fixed height container to prevent layout jumping */}
                                <div className="flex h-[80px] w-full max-w-[24px] flex-col justify-end">
                                    <div
                                        className={`w-full max-w-[24px] rounded-lg transition-all duration-500 ${count > 0
                                            ? isToday ? 'gradient-primary shadow-sm' : 'bg-primary-300'
                                            : 'bg-gray-100'
                                            }`}
                                        style={{ height: h }}
                                    />
                                </div>
                                <span className={`text-[10px] font-medium ${isToday ? 'text-primary-600 font-bold' : 'text-gray-400'}`}>
                                    {dayNames[dayOfWeek]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Milestones */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">Pencapaian</h2>
                <div className="space-y-3">
                    {LEVELS.map((m) => (
                        <div
                            key={m.name}
                            className={`flex items-center gap-3 rounded-xl p-3 ${totalXP >= m.minXP
                                ? 'bg-primary-50 border border-primary-100'
                                : 'bg-gray-50'
                                }`}
                        >
                            <span className="text-xl">{m.emoji}</span>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${totalXP >= m.minXP ? 'text-primary-700' : 'text-gray-400'}`}>
                                    {m.name}
                                </p>
                                <p className="text-xs text-gray-400">{m.minXP} XP</p>
                            </div>
                            {totalXP >= m.minXP && (
                                <span className="text-primary-500">✓</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
