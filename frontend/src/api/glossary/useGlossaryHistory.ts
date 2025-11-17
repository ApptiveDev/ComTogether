import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../core/query-config';
import { glossaryService } from '@/api/services/glossaryService';

/**
 * 검색 기록을 가져오는 React Query 훅
 * @param size 조회할 검색 기록 개수 (기본값: 30)
 */
export const useGlossaryHistory = (size: number = 30) => {
  return useQuery({
    queryKey: queryKeys.GLOSSARY.HISTORY(size),
    queryFn: () => glossaryService.getGlossaryHistory(size),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};

/**
 * 검색 기록을 삭제하는 React Query 훅
 */
export const useDeleteGlossaryHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: number) => glossaryService.deleteGlossaryHistory(historyId),
    onSuccess: () => {
      // 삭제 성공 시 검색 기록 목록을 다시 불러옴
      queryClient.invalidateQueries({ queryKey: queryKeys.GLOSSARY.HISTORY() });
    },
  });
};
