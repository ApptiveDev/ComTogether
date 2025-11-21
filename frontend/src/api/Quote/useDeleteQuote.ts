import { useMutation } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';

export const useDeleteQuote = () => {
  return useMutation({
    mutationFn: (quoteId: number) => quoteService.deleteQuote(quoteId),
  });
};