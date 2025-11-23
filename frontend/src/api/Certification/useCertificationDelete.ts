import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import type { CommonMutationOptions } from '../core/queryConfig';

// 전문가 인증 삭제
export function useCertificationDelete(
  options?: CommonMutationOptions<void, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certId: number) => {
      const response = await client.delete<void>(API_ENDPOINTS.CERTIFICATION.DELETE(certId));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}