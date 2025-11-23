import { useQuery } from '@tanstack/react-query';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import type { Certification } from '../../types/api';
import type { CommonQueryOptions } from '../core/queryConfig';

// 전문가 인증 목록 조회 (사용자용)
export function useCertificationGet(
  options?: CommonQueryOptions<Certification[]>
) {
  return useQuery({
    queryKey: ['certification', 'me'],
    queryFn: async () => {
      const response = await client.get<Certification[]>(API_ENDPOINTS.CERTIFICATION.ME);
      return response.data;
    },
    ...options,
  });
}