import { useQuery } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useQuoteDetail = (quoteId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUOTE_DETAIL, quoteId],
    queryFn: () => quoteService.getQuoteDetail(quoteId),
    enabled: !!quoteId,
  });
};