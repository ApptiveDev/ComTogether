import { glossaryService } from '@/api/services/glossaryService';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../core/query-config';

/**
 * 용어 상세 정보를 가져오는 React Query 훅
 * @param query 용어 ID (없을 경우 null)
 */
export const useGlossaryDetail = (query: string | null) => {
  return useQuery({
    queryKey: queryKeys.GLOSSARY.DETAIL(query as string),
    queryFn: () => glossaryService.getGlossaryDetail(query as string),
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};