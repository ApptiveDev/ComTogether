import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../core';
import { API_ENDPOINTS } from '../../core/types';
import type { CertificationApproveRequest } from '../../../types/api';
import type { CommonMutationOptions } from '../../core/queryConfig';

// 전문가 인증 승인 (관리자용)
export function useCertificationApprove(
  options?: CommonMutationOptions<void, CertificationApproveRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ certId }: CertificationApproveRequest) => {
      const response = await client.patch<void>(API_ENDPOINTS.CERTIFICATION.APPROVE(certId));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}