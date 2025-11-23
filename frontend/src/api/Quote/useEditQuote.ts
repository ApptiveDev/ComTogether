import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { UpdateQuoteRequest } from '@/types/quote';

interface EditQuoteParams {
  quoteId: number;
  data: UpdateQuoteRequest;
}

export const useEditQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quoteId, data }: EditQuoteParams) =>
      quoteService.updateQuote(quoteId, data),
    onSuccess: () => {
      // 견적서 수정 후 견적서 목록 자동 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTES] });
    },
    onError: (error) => {
      console.error('견적서 수정 실패:', error);
    }
  });
};