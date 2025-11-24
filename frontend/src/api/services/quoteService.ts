// Quote 관련 API 서비스

import { client } from '../core/client';
import { API_ENDPOINTS } from '@/config/api';
import type { ApiResponse } from '@/types/api';
import type {
  Quote,
  QuoteListResponse,
  CreateQuoteRequest,
  UpdateQuoteRequest,
} from '@/types/quote';

export const quoteService = {
  // 견적서 생성
  createQuote: async (data: CreateQuoteRequest): Promise<ApiResponse<null>> => {
    return client.post(API_ENDPOINTS.QUOTES.BASE, data);
  },

  // 견적서 목록 조회
  getQuotes: async (): Promise<ApiResponse<QuoteListResponse[]>> => {
    return client.get(API_ENDPOINTS.QUOTES.BASE);
  },

  // 견적서 상세 조회
  getQuoteDetail: async (quoteId: number): Promise<ApiResponse<Quote>> => {
    return client.get(API_ENDPOINTS.QUOTES.DETAIL(quoteId));
  },

  // 견적서 수정
  updateQuote: async (
    quoteId: number,
    data: UpdateQuoteRequest
  ): Promise<ApiResponse<null>> => {
    return client.put(API_ENDPOINTS.QUOTES.DETAIL(quoteId), data);
  },

  // 견적서 삭제
  deleteQuote: async (quoteId: number): Promise<ApiResponse<null>> => {
    return client.delete(API_ENDPOINTS.QUOTES.DETAIL(quoteId));
  },
};
