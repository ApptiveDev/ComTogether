import { useQuery } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useGetQuotes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUOTES],
    queryFn: () => quoteService.getQuotes(),
  });
};