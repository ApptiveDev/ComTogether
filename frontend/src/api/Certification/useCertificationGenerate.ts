import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import type { CertificationGenerateRequest } from '../../types/api';
import type { CommonMutationOptions } from '../core/queryConfig';

// 전문가 인증 생성
export function useCertificationGenerate(
  options?: CommonMutationOptions<void, CertificationGenerateRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CertificationGenerateRequest) => {
      const response = await client.post<void>(API_ENDPOINTS.CERTIFICATION.BASE, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}