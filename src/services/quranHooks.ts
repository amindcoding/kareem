import { useQuery } from '@tanstack/react-query';
import { getSurahList, getSurahDetail, getTafsir } from './quranApi';

export function useSurahList() {
    return useQuery({
        queryKey: ['surahs'],
        queryFn: getSurahList,
        staleTime: Infinity, // Surah list never changes
    });
}

export function useSurahDetail(id: number) {
    return useQuery({
        queryKey: ['surah', id],
        queryFn: () => getSurahDetail(id),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: !!id,
    });
}

export function useTafsir(id: number) {
    return useQuery({
        queryKey: ['tafsir', id],
        queryFn: () => getTafsir(id),
        staleTime: Infinity,
        enabled: !!id,
    });
}
