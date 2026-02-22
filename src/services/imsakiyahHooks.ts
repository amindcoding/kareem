import { useQuery } from '@tanstack/react-query';
import { getProvinsi, getKabkota, getImsakiyah, getShalat } from './imsakiyahApi';

export function useProvinsi() {
    return useQuery({
        queryKey: ['provinsi'],
        queryFn: getProvinsi,
        staleTime: Infinity,
    });
}

export function useKabkota(provinsi: string) {
    return useQuery({
        queryKey: ['kabkota', provinsi],
        queryFn: () => getKabkota(provinsi),
        staleTime: Infinity,
        enabled: !!provinsi,
    });
}

export function useImsakiyah(provinsi: string, kabkota: string) {
    return useQuery({
        queryKey: ['imsakiyah', provinsi, kabkota],
        queryFn: () => getImsakiyah(provinsi, kabkota),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: !!provinsi && !!kabkota,
    });
}

export function useShalat(provinsi: string, kabkota: string, bulan?: number, tahun?: number) {
    return useQuery({
        queryKey: ['shalat', provinsi, kabkota, bulan, tahun],
        queryFn: () => getShalat(provinsi, kabkota, bulan, tahun),
        staleTime: 1000 * 60 * 60,
        enabled: !!provinsi && !!kabkota,
    });
}
