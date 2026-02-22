'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTrackerStore } from '@/lib/stores/useTrackerStore';
import { DEFAULT_HABITS, toLocalISODate } from '@/lib/constants';
import { Habit } from '@/types';
import HabitCard from '@/components/HabitCard';
import AddHabitModal from '@/components/AddHabitModal';
import { useLocationStore } from '@/lib/stores/useLocationStore';
import { useImsakiyah } from '@/services/imsakiyahHooks';
import { getTodayRamadanDay, getRamadanDate, formatDateId, getHariName } from '@/lib/ramadan';

function TrackerContent() {
    const searchParams = useSearchParams();
    const dayParam = searchParams.get('day');

    const { customHabits, todayXP, isLoaded, loadToday } = useTrackerStore();
    const { provinsi, kabkota } = useLocationStore();
    const { data: imsakiyah } = useImsakiyah(provinsi, kabkota);
    const todayTanggal = imsakiyah ? getTodayRamadanDay(imsakiyah.hijriah) : 0;

    // Determine active date from param (if exists) or today
    const activeDayNumber = dayParam ? parseInt(dayParam) || todayTanggal : todayTanggal;
    const isPastDate = activeDayNumber < todayTanggal;

    // Resolve full YYYY-MM-DD string
    const targetDateObj = activeDayNumber && imsakiyah ? getRamadanDate(imsakiyah.hijriah, activeDayNumber) : new Date();
    const targetDateStr = toLocalISODate(targetDateObj);

    // Grab correct daily schedule from raw imsakiyah
    const activeSchedule = imsakiyah?.imsakiyah.find((d) => d.tanggal === activeDayNumber);

    useEffect(() => {
        if (imsakiyah) {
            // Only load when imsakiyah data is ready to calculate correct active date string
            loadToday(targetDateStr);
        }
    }, [loadToday, targetDateStr, imsakiyah]);

    // Group default habits by category
    const wajib = DEFAULT_HABITS.filter((h) => h.category === 'wajib');
    const sunnah = DEFAULT_HABITS.filter((h) => h.category === 'sunnah');
    const umum = DEFAULT_HABITS.filter((h) => h.category === 'umum');

    // Custom habits as Habit type
    const customAsHabits: Habit[] = customHabits.map((ch) => ({
        id: `custom-${ch.id}`,
        name: ch.name,
        icon: ch.icon,
        xp: ch.xp,
        category: ch.category,
        isDefault: false,
    }));

    if (!isLoaded) {
        return (
            <div className="page-enter space-y-3 px-4 pt-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton h-16 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="page-enter space-y-6 px-4 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        {isPastDate ? `Ibadah Hari ke-${activeDayNumber}` : 'Ibadah Harian'}
                    </h1>
                    <p className="text-xs text-gray-400">
                        {isPastDate
                            ? `${getHariName(targetDateObj)}, ${formatDateId(targetDateObj)}`
                            : 'Centang ibadah yang sudah kamu lakukan'
                        }
                    </p>
                </div>
                <div className="rounded-xl bg-primary-50 px-3 py-1.5 flex flex-col items-end">
                    <p className="text-sm font-semibold text-primary-600">+{todayXP} XP</p>
                    {isPastDate && <span className="text-[9px] text-primary-400">di hari ini</span>}
                </div>
            </div>

            {/* Wajib */}
            <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Wajib
                </h2>
                <div className="space-y-2">
                    {wajib.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} todaySchedule={activeSchedule} isPastDate={isPastDate} />
                    ))}
                </div>
            </section>

            {/* Sunnah */}
            <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Sunnah
                </h2>
                <div className="space-y-2">
                    {sunnah.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} todaySchedule={activeSchedule} isPastDate={isPastDate} />
                    ))}
                </div>
            </section>

            {/* Umum */}
            <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Umum
                </h2>
                <div className="space-y-2">
                    {umum.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} todaySchedule={activeSchedule} isPastDate={isPastDate} />
                    ))}
                </div>
            </section>

            {/* Custom Habits */}
            {customAsHabits.length > 0 && (
                <section>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Kustom
                    </h2>
                    <div className="space-y-2">
                        {customAsHabits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                todaySchedule={activeSchedule}
                                isPastDate={isPastDate}
                                onDelete={() => {
                                    const id = Number(habit.id.replace('custom-', ''));
                                    if (!isNaN(id)) {
                                        useTrackerStore.getState().deleteCustomHabit(id);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            <AddHabitModal />
        </div>
    );
}

export default function TrackerPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-sm text-gray-500">Memuat tracker...</div>}>
            <TrackerContent />
        </Suspense>
    );
}
