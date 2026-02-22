'use client';

import { Habit, ImsakiyahDay } from '@/types';
import { useTrackerStore } from '@/lib/stores/useTrackerStore';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface HabitCardProps {
    habit: Habit;
    todaySchedule?: ImsakiyahDay;
    onDelete?: () => void;
    isPastDate?: boolean;
}

function parseTime(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

const getNowMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

export default function HabitCard({ habit, todaySchedule, onDelete, isPastDate }: HabitCardProps) {
    const { todayLogs, toggleHabit } = useTrackerStore();
    const isCompleted = todayLogs[habit.id] || false;

    const handleToggle = () => {
        // If checking a habit (not unchecking), validate if it's a prayer that hasn't arrived
        // Allow immediately if this card is rendered for a past day.
        if (!isCompleted && todaySchedule && !isPastDate) {
            const prayerMap: Record<string, keyof ImsakiyahDay | undefined> = {
                'sholat-subuh': 'subuh',
                'sholat-dzuhur': 'dzuhur',
                'sholat-ashar': 'ashar',
                'sholat-maghrib': 'maghrib',
                'sholat-isya': 'isya',
                'sholat-dhuha': 'dhuha',
            };

            const checkKey = prayerMap[habit.id];
            if (checkKey) {
                const timeStr = todaySchedule[checkKey] as string;
                if (timeStr) {
                    const prayerMinutes = parseTime(timeStr);
                    const nowMinutes = getNowMinutes();
                    if (nowMinutes < prayerMinutes) {
                        toast.error((t) => (
                            <div key={t.id} onClick={() => toast.dismiss(t.id)} className="flex items-center gap-2">
                                <span className="text-lg">{habit.icon}</span>
                                <span>Belum masuk waktu {habit.name} ({timeStr})</span>
                            </div>
                        ), {
                            id: `prayer-early-${habit.id}`,
                            duration: 5000,
                            style: { borderRadius: '12px', background: '#333', color: '#fff', fontSize: '14px' }
                        });
                        return; // Block checking
                    }
                }
            }
        }
        toggleHabit(habit);
    };

    return (
        <button
            onClick={handleToggle}
            className={`group flex w-full items-center gap-3 rounded-2xl border p-4 transition-all duration-300 btn-press ${isCompleted
                ? 'border-primary-200 bg-primary-50 shadow-sm'
                : 'border-gray-100 bg-white shadow-card hover:shadow-card-hover'
                }`}
        >
            {/* Icon */}
            <span className="text-2xl">{habit.icon}</span>

            {/* Name & XP */}
            <div className="flex-1 text-left">
                <p
                    className={`font-semibold transition-colors ${isCompleted ? 'text-primary-700' : 'text-gray-800'
                        }`}
                >
                    {habit.name}
                </p>
                <p className="text-xs text-gray-400">+{habit.xp} XP</p>
            </div>

            {/* Check indicator */}
            <div className="flex items-center gap-3">
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
                <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 gap-2 ${isCompleted
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-gray-300 group-hover:border-primary-400'
                        }`}
                >
                    {isCompleted && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    );
}
