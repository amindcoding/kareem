import { create } from 'zustand';
import { db } from '@/lib/db';
import { getToday } from '@/lib/constants';
import { Habit, CustomHabit, StreakInfo } from '@/types';
import { calculateStreak } from '@/lib/streak';
import { getLevelProgress } from '@/lib/xp';

interface TrackerState {
    // Data
    todayLogs: Record<string, boolean>;
    customHabits: CustomHabit[];
    totalXP: number;
    todayXP: number;
    streak: StreakInfo;
    levelProgress: number;
    isLoaded: boolean;
    activeDate: string;

    // Actions
    loadToday: (dateOverride?: string) => Promise<void>;
    toggleHabit: (habit: Habit) => Promise<void>;
    addCustomHabit: (name: string, icon: string, category: 'wajib' | 'sunnah' | 'umum') => Promise<void>;
    deleteCustomHabit: (id: number) => Promise<void>;
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
    todayLogs: {},
    customHabits: [],
    totalXP: 0,
    todayXP: 0,
    streak: { current: 0, longest: 0, lastActiveDate: null },
    level: 1,
    levelProgress: 0,
    isLoaded: false,
    activeDate: getToday(),

    loadToday: async (dateOverride?: string) => {
        const targetDate = dateOverride || getToday();

        // Load targeted day's logs
        const logs = await db.habitLogs.where('date').equals(targetDate).toArray();
        const todayLogs: Record<string, boolean> = {};
        logs.forEach((log) => {
            todayLogs[log.habitId] = log.completed;
        });

        // Load custom habits
        const customHabits = await db.customHabits.toArray();

        // Calculate total XP
        const allLogs = await db.habitLogs.toArray();
        const totalXP = allLogs
            .filter((l) => l.completed)
            .reduce((sum, l) => sum + l.xpEarned, 0);

        const todayXP = logs
            .filter((l) => l.completed)
            .reduce((sum, l) => sum + l.xpEarned, 0);

        // Calculate streak
        const streak = await calculateStreak();

        const levelProgress = getLevelProgress(totalXP);

        set({
            todayLogs,
            customHabits,
            totalXP,
            todayXP,
            streak,
            levelProgress,
            isLoaded: true,
            activeDate: targetDate,
        });
    },

    toggleHabit: async (habit: Habit) => {
        const { todayLogs, activeDate } = get();
        const isCurrentlyDone = todayLogs[habit.id] || false;
        const newCompleted = !isCurrentlyDone;

        // Check if log exists
        const existing = await db.habitLogs
            .where('[date+habitId]')
            .equals([activeDate, habit.id])
            .first();

        if (existing) {
            await db.habitLogs.update(existing.id!, {
                completed: newCompleted,
                xpEarned: newCompleted ? habit.xp : 0,
            });
        } else {
            await db.habitLogs.add({
                habitId: habit.id,
                date: activeDate,
                completed: newCompleted,
                xpEarned: newCompleted ? habit.xp : 0,
            });
        }

        // Reload with the same activeDate to prevent hijacking back to today
        await get().loadToday(activeDate);
    },

    addCustomHabit: async (name, icon, category) => {
        await db.customHabits.add({
            name,
            icon,
            xp: 10,
            category,
            createdAt: new Date().toISOString(),
        });
        await get().loadToday(get().activeDate);
    },

    deleteCustomHabit: async (id: number) => {
        await db.customHabits.delete(id);
        await get().loadToday(get().activeDate);
    },
}));
