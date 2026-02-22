import { db } from './db';
import { StreakInfo } from '@/types';
import { parseLocalDate } from '@/lib/constants';

/**
 * Calculate streak info by scanning habitLogs backward from today.
 */
export async function calculateStreak(): Promise<StreakInfo> {
    // Get all unique dates with at least one completed habit, sorted descending
    const allLogs = await db.habitLogs.toArray();
    const logs = allLogs.filter((l) => l.completed);

    const uniqueDates = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();

    if (uniqueDates.length === 0) {
        return { current: 0, longest: 0, lastActiveDate: null };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the most recent active date is today or yesterday
    const lastActive = parseLocalDate(uniqueDates[0]);
    lastActive.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
        (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If the last active date is more than 1 day ago, streak is broken
    let currentStreak = 0;
    if (diffDays <= 1) {
        currentStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const prev = parseLocalDate(uniqueDates[i - 1]);
            const curr = parseLocalDate(uniqueDates[i]);
            const diff = Math.floor(
                (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (diff === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    let longestStreak = 1;
    let tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
        const prev = parseLocalDate(uniqueDates[i - 1]);
        const curr = parseLocalDate(uniqueDates[i]);
        const diff = Math.floor(
            (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }
    if (uniqueDates.length === 1) longestStreak = 1;

    return {
        current: currentStreak,
        longest: Math.max(longestStreak, currentStreak),
        lastActiveDate: uniqueDates[0],
    };
}
