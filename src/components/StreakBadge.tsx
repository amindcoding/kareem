'use client';

interface StreakBadgeProps {
    current: number;
    longest: number;
}

export default function StreakBadge({ current, longest }: StreakBadgeProps) {
    return (
        <div className="flex gap-3">
            {/* Current Streak */}
            <div className="flex-1 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-center shadow-card">
                <p className="text-3xl font-bold text-accent-500">
                    {current}
                    <span className="ml-1 text-lg">🔥</span>
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">Streak Saat Ini</p>
            </div>

            {/* Longest Streak */}
            <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-card">
                <p className="text-3xl font-bold text-gray-700">
                    {longest}
                    <span className="ml-1 text-lg">⭐</span>
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">Streak Terpanjang</p>
            </div>
        </div>
    );
}
