import { useMutation } from '@tanstack/react-query';
import { quoteService } from '../services/quoteService';
import type { CreateQuoteRequest } from '@/types/quote';

export const usePostQuote = () => {
  return useMutation({
    mutationFn: (data: CreateQuoteRequest) => quoteService.createQuote(data),
  });
};