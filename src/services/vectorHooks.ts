import { useQuery } from '@tanstack/react-query';
import { vectorSearch } from './vectorApi';

export function useVectorSearch(query: string) {
    return useQuery({
        queryKey: ['vector', query],
        queryFn: () => vectorSearch(query, ['ayat', 'tafsir'], 10, 0.1),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: query.length > 2,
    });
}
