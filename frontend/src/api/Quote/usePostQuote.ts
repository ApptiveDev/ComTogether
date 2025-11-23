import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { CreateQuoteRequest } from '@/types/quote';

export const usePostQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuoteRequest) => quoteService.createQuote(data),
    onSuccess: () => {
      // 견적서 생성 후 견적서 목록 자동 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTES] });
    },
    onError: (error) => {
      console.error('견적서 생성 실패:', error);
      // 에러 토스트 알림 등 추가 처리 가능
    }
  });
};