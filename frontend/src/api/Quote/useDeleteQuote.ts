import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: number) => quoteService.deleteQuote(quoteId),
    onSuccess: () => {
      // 견적서 삭제 후 견적서 목록 자동 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTES] });
    },
    onError: (error) => {
      console.error('견적서 삭제 실패:', error);
    }
  });
};