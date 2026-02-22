import { ApiResponse, Surah, SurahDetail, TafsirResponse } from '@/types';

const BASE_URL = 'https://equran.id/api/v2';

export async function getSurahList(): Promise<Surah[]> {
    const res = await fetch(`${BASE_URL}/surat`);
    if (!res.ok) throw new Error('Gagal memuat daftar surah');
    const json: ApiResponse<Surah[]> = await res.json();
    return json.data;
}

export async function getSurahDetail(id: number): Promise<SurahDetail> {
    const res = await fetch(`${BASE_URL}/surat/${id}`);
    if (!res.ok) throw new Error(`Gagal memuat surah ${id}`);
    const json: ApiResponse<SurahDetail> = await res.json();
    return json.data;
}

export async function getTafsir(id: number): Promise<TafsirResponse> {
    const res = await fetch(`${BASE_URL}/tafsir/${id}`);
    if (!res.ok) throw new Error(`Gagal memuat tafsir surah ${id}`);
    const json: ApiResponse<TafsirResponse> = await res.json();
    return json.data;
}
