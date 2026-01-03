import { useQuery } from '@tanstack/react-query';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { ApiResponse } from '@/types/api';

export interface InterestOption {
  interestId: number;
  name: string;
}

export function useGetInterests() {
  return useQuery<ApiResponse<InterestOption[]>>({
    queryKey: [QUERY_KEYS.INTERESTS],
    queryFn: async () => {
      return client.get<InterestOption[]>(API_ENDPOINTS.INTERESTS.LIST);
    },
    staleTime: 1000 * 60 * 60, // 1시간 캐시 (관심사 목록은 자주 변경되지 않음)
  });
}
