/**
 * Ramadan date utilities.
 *
 * We derive the Gregorian start date of Ramadan from the Hijri year
 * returned by the Imsakiyah API. This avoids hardcoding and adapts
 * automatically when the API returns a different Hijri year.
 */

// Known Ramadan 1 start dates (Gregorian) by Hijri year
const RAMADAN_START: Record<string, string> = {
    '1446': '2025-03-01',
    '1447': '2026-02-19',
    '1448': '2027-02-08',
    '1449': '2028-01-28',
};

/**
 * Get Ramadan 1's Gregorian date from the API's hijriah year.
 * Parses as local time.
 */
export function getRamadanStart(hijriah: string): Date {
    const dateStr = RAMADAN_START[hijriah];
    const target = dateStr || '2026-02-19'; // Fallback: 1447
    const [y, m, d] = target.split('-').map(Number);
    return new Date(y, m - 1, d);
}

/**
 * Calculate today's Ramadan day number (1-indexed).
 * Returns 0 if today is before Ramadan starts.
 */
export function getTodayRamadanDay(hijriah: string): number {
    const start = getRamadanStart(hijriah);
    const now = new Date();
    // Reset to midnight for accurate day diff
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffMs = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 1 Ramadhan = day 1
}

/**
 * Get the Gregorian date for a given Ramadan day number.
 */
export function getRamadanDate(hijriah: string, tanggal: number): Date {
    const start = getRamadanStart(hijriah);
    const d = new Date(start);
    d.setDate(d.getDate() + tanggal - 1);
    return d;
}

/**
 * Format a date to Indonesian day name.
 */
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export function getHariName(date: Date): string {
    return HARI[date.getDay()];
}

/**
 * Format a date to "DD MMM YYYY" in Indonesian.
 */
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export function formatDateId(date: Date): string {
    return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}
