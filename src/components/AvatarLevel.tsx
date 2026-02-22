'use client';

import { getLevelFromXP } from '@/lib/xp';

interface AvatarLevelProps {
    totalXP: number;
}

export default function AvatarLevel({ totalXP }: AvatarLevelProps) {
    const level = getLevelFromXP(totalXP);

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary-200/40 blur-xl" />
                {/* Avatar */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white shadow-lg">
                    <span className="text-5xl">{level.emoji}</span>
                </div>
            </div>
            <p className="mt-3 text-lg font-bold text-gray-800">{level.name}</p>
            <p className="text-sm font-medium text-primary-600">Level {level.level}</p>
        </div>
    );
}
