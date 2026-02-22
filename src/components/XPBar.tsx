'use client';

import { getLevelFromXP, getLevelProgress } from '@/lib/xp';
import { LEVELS } from '@/lib/constants';

interface XPBarProps {
    totalXP: number;
}

export default function XPBar({ totalXP }: XPBarProps) {
    const currentLevel = getLevelFromXP(totalXP);
    const progress = getLevelProgress(totalXP);
    const currentIdx = LEVELS.findIndex((l) => l.level === currentLevel.level);
    const nextLevel = LEVELS[currentIdx + 1];

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            {/* Level Header */}
            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentLevel.emoji}</span>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            Level {currentLevel.level} — {currentLevel.name}
                        </p>
                        <p className="text-xs text-gray-400">{totalXP} XP total</p>
                    </div>
                </div>
                {nextLevel && (
                    <p className="text-xs font-medium text-accent-500">
                        {nextLevel.minXP - totalXP} XP lagi → {nextLevel.emoji}
                    </p>
                )}
            </div>

            {/* Progress Bar */}
            <div className="h-3 overflow-hidden rounded-full bg-primary-100">
                <div
                    className="h-full rounded-full gradient-primary transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
