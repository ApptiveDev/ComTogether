import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../core/queryConfig';
import { glossaryService } from '@/api/services/glossaryService';

/**
 * 용어 자동완성 데이터를 가져오는 React Query 훅
 * @param keyword 검색 키워드
 */
export const useGlossaryAutoComplete = (keyword: string) => {
  return useQuery({
    queryKey: queryKeys.GLOSSARY.AUTO_COMPLETE(keyword),
    queryFn: () => glossaryService.getAutoComplete(keyword),
    // 키워드가 비어있지 않을 때만 쿼리를 실행합니다.
    enabled: !!keyword,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분 (cacheTime에서 변경)
    retry: false, // 재시도 방지
    // 에러 발생 시 빈 배열로 fallback
    placeholderData: [],
  });
};