import { VectorSearchResponse } from '@/types';

export async function vectorSearch(
    cari: string,
    type?: string[],
    batas?: number,
    skorMin?: number
): Promise<VectorSearchResponse> {
    const body: Record<string, unknown> = { cari };
    if (type) body.type = type;
    if (batas) body.batas = batas;
    if (skorMin) body.skorMin = skorMin;

    const res = await fetch('https://equran.id/api/vector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Gagal melakukan pencarian');
    return res.json();
}
