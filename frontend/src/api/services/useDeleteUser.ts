import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { apiClient } from '../core/client';
import type { CommonMutationOptions } from '../core/query-config';
import { API_ENDPOINTS } from '../core/types';

// 계정 삭제
export function useDeleteUser(
  options?: CommonMutationOptions<void, void>
) {
  const { clearAuthState } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE);
      return response;
    },
    onSuccess: () => {
      clearAuthState();
      window.location.href = '/signIn';
    },
    ...options,
  });
}