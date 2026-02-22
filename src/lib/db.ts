import Dexie, { type EntityTable } from 'dexie';
import { HabitLog, CustomHabit, Bookmark } from '@/types';

const db = new Dexie('KareemDB') as Dexie & {
    habitLogs: EntityTable<HabitLog, 'id'>;
    customHabits: EntityTable<CustomHabit, 'id'>;
    bookmarks: EntityTable<Bookmark, 'id'>;
};

db.version(1).stores({
    habitLogs: '++id, [date+habitId], date',
    customHabits: '++id',
    bookmarks: '++id, surahId, ayahNumber',
});

export { db };
