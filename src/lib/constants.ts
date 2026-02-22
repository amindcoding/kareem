import { Habit, LevelInfo } from '@/types';

// ── Default Habits ──────────────────────────────────────
export const DEFAULT_HABITS: Habit[] = [
    { id: 'sholat-subuh', name: 'Sholat Subuh', icon: '🌅', xp: 20, category: 'wajib', isDefault: true },
    { id: 'sholat-dzuhur', name: 'Sholat Dzuhur', icon: '☀️', xp: 20, category: 'wajib', isDefault: true },
    { id: 'sholat-ashar', name: 'Sholat Ashar', icon: '🌤️', xp: 20, category: 'wajib', isDefault: true },
    { id: 'sholat-maghrib', name: 'Sholat Maghrib', icon: '🌇', xp: 20, category: 'wajib', isDefault: true },
    { id: 'sholat-isya', name: 'Sholat Isya', icon: '🌙', xp: 20, category: 'wajib', isDefault: true },
    { id: 'sholat-tarawih', name: 'Sholat Tarawih', icon: '✨', xp: 15, category: 'sunnah', isDefault: true },
    { id: 'sholat-tahajud', name: 'Sholat Tahajud', icon: '🌌', xp: 15, category: 'sunnah', isDefault: true },
    { id: 'sholat-dhuha', name: 'Sholat Dhuha', icon: '🌞', xp: 10, category: 'sunnah', isDefault: true },
    { id: 'puasa', name: 'Puasa Ramadan', icon: '🍽️', xp: 30, category: 'wajib', isDefault: true },
    { id: 'tilawah', name: 'Tilawah Al-Quran', icon: '📖', xp: 15, category: 'umum', isDefault: true },
    { id: 'sedekah', name: 'Sedekah', icon: '💝', xp: 15, category: 'umum', isDefault: true },
    { id: 'dzikir', name: 'Dzikir & Doa', icon: '📿', xp: 10, category: 'umum', isDefault: true },
];

// ── Level Thresholds ────────────────────────────────────
export const LEVELS: LevelInfo[] = [
    { level: 1, name: 'Benih', emoji: '🌱', minXP: 0 },
    { level: 2, name: 'Tunas', emoji: '🌿', minXP: 100 },
    { level: 3, name: 'Pohon', emoji: '🌳', minXP: 300 },
    { level: 4, name: 'Bintang', emoji: '🌟', minXP: 600 },
    { level: 5, name: 'Juara', emoji: '🏆', minXP: 1000 },
    { level: 6, name: 'Berlian', emoji: '💎', minXP: 3000 },
    { level: 7, name: 'Istiqomah', emoji: '🕋', minXP: 5000 },
];

// ── Helpers ─────────────────────────────────────────────
export const toLocalISODate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const parseLocalDate = (dateStr: string): Date => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

export const getToday = (): string => {
    return toLocalISODate(new Date());
};
