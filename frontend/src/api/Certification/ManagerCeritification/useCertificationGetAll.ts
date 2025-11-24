import { useQuery } from '@tanstack/react-query';
import client from '../../core';
import { API_ENDPOINTS } from '../../core/types';
import type { Certification } from '../../../types/api';
import type { CommonQueryOptions } from '../../core/queryConfig';

// 전문가 인증 목록 전체 조회 (관리자용)
export function useCertificationGetAll(
  options?: CommonQueryOptions<Certification[]>
) {
  return useQuery({
    queryKey: ['certification', 'all'],
    queryFn: async () => {
      const response = await client.get<Certification[]>(API_ENDPOINTS.CERTIFICATION.ALL);
      return response.data;
    },
    ...options,
  });
}