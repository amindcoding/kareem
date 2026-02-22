import { useQuery } from '@tanstack/react-query';
import { getAllDoa } from './doaApi';

export function useDoa() {
    return useQuery({
        queryKey: ['doa'],
        queryFn: getAllDoa,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours — doa data rarely changes
    });
}
