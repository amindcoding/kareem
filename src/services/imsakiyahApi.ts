import { ApiResponse, ImsakiyahResponse, ShalatResponse } from '@/types';

const BASE_URL = 'https://equran.id/api/v2';

export async function getProvinsi(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/imsakiyah/provinsi`);
    if (!res.ok) throw new Error('Gagal memuat daftar provinsi');
    const json: ApiResponse<string[]> = await res.json();
    return json.data;
}

export async function getKabkota(provinsi: string): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/imsakiyah/kabkota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provinsi }),
    });
    if (!res.ok) throw new Error('Gagal memuat daftar kabupaten/kota');
    const json: ApiResponse<string[]> = await res.json();
    return json.data;
}

export async function getImsakiyah(
    provinsi: string,
    kabkota: string
): Promise<ImsakiyahResponse> {
    const res = await fetch(`${BASE_URL}/imsakiyah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provinsi, kabkota }),
    });
    if (!res.ok) throw new Error('Gagal memuat jadwal imsakiyah');
    const json: ApiResponse<ImsakiyahResponse> = await res.json();
    return json.data;
}

export async function getShalat(
    provinsi: string,
    kabkota: string,
    bulan?: number,
    tahun?: number
): Promise<ShalatResponse> {
    const res = await fetch(`${BASE_URL}/shalat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provinsi, kabkota, bulan, tahun }),
    });
    if (!res.ok) throw new Error('Gagal memuat jadwal shalat');
    const json: ApiResponse<ShalatResponse> = await res.json();
    return json.data;
}
