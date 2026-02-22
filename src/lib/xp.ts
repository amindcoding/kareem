import { LEVELS } from './constants';
import { LevelInfo } from '@/types';
import { db } from './db';

/**
 * Get the current level based on total XP.
 */
export function getLevelFromXP(totalXP: number): LevelInfo {
    let current = LEVELS[0];
    for (const level of LEVELS) {
        if (totalXP >= level.minXP) {
            current = level;
        } else {
            break;
        }
    }
    return current;
}

/**
 * Get progress to next level (0–100).
 */
export function getLevelProgress(totalXP: number): number {
    const current = getLevelFromXP(totalXP);
    const currentIdx = LEVELS.findIndex((l) => l.level === current.level);
    const next = LEVELS[currentIdx + 1];

    if (!next) return 100; // Max level
    const range = next.minXP - current.minXP;
    const progress = totalXP - current.minXP;
    return Math.min(Math.round((progress / range) * 100), 100);
}

/**
 * Calculate total XP from all habit logs.
 */
export async function calculateTotalXP(): Promise<number> {
    const allLogs = await db.habitLogs.toArray();
    const logs = allLogs.filter((l) => l.completed);
    return logs.reduce((sum, log) => sum + log.xpEarned, 0);
}

/**
 * Calculate XP earned today.
 */
export async function calculateTodayXP(today: string): Promise<number> {
    const logs = await db.habitLogs
        .where('date')
        .equals(today)
        .toArray();
    return logs
        .filter((l) => l.completed)
        .reduce((sum, log) => sum + log.xpEarned, 0);
}
