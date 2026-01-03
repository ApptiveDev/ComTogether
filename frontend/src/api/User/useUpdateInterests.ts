import { useMutation } from '@tanstack/react-query';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import { invalidateQueries } from '../core/queryConfig';
import type { CommonMutationOptions } from '../core/queryConfig';
import type { UserData, UpdateInterestsPayload } from '@/types/user';
import { useAuthStore } from '@/stores/useAuthStore';
import type { ApiResponse, ApiError } from '@/types/api';

export function useUpdateInterests(
  options?: CommonMutationOptions<UserData, UpdateInterestsPayload>,
) {
  const { setUser } = useAuthStore();

  return useMutation<ApiResponse<UserData>, ApiError, UpdateInterestsPayload>({
    mutationFn: async (payload: UpdateInterestsPayload) => {
      return client.put<UserData>(API_ENDPOINTS.USERS.INTERESTS, payload);
    },
    ...options,
    onSuccess: (response, variables, context) => {
      if (response.success && response.data) {
        setUser(response.data);
      }
      invalidateQueries.user();
      invalidateQueries.userProfile();
      options?.onSuccess?.(response, variables, context);
    },
  });
}
