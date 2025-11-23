import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../core';
import { API_ENDPOINTS } from '../../core/types';
import type { CertificationRejectRequest } from '../../../types/api';
import type { CommonMutationOptions } from '../../core/queryConfig';

// 전문가 인증 거절 (관리자용)
export function useCertificationReject(
  options?: CommonMutationOptions<void, CertificationRejectRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ certId, reason }: CertificationRejectRequest) => {
      const response = await client.patch<void>(
        `${API_ENDPOINTS.CERTIFICATION.REJECT(certId)}?reason=${encodeURIComponent(reason)}`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}