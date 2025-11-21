import { useMutation } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import type { UpdateQuoteRequest } from '@/types/quote';

interface EditQuoteParams {
  quoteId: number;
  data: UpdateQuoteRequest;
}

export const useEditQuote = () => {
  return useMutation({
    mutationFn: ({ quoteId, data }: EditQuoteParams) =>
      quoteService.updateQuote(quoteId, data),
  });
};