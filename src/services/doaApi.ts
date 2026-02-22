import { Doa } from '@/types';

export async function getAllDoa(): Promise<Doa[]> {
    const res = await fetch('https://equran.id/api/doa');
    if (!res.ok) throw new Error('Gagal memuat doa');
    const json = await res.json();
    // API may return bare array or { data: [...] }
    return Array.isArray(json) ? json : json.data;
}
