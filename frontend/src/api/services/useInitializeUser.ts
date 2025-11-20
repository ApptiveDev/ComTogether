import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import client from '../core';
import { 
  invalidateQueries 
} from '../core/queryConfig';
import type { CommonMutationOptions } from '../core/queryConfig';
import { API_ENDPOINTS } from '../core/types';
import type { UserData } from '../../types/user';

// 사용자 초기화
interface InitializeUserRequest {
  role: string;
  interest_ids: number[];
  custom_interests?: string[];
}

export function useInitializeUser(
  options?: CommonMutationOptions<UserData, InitializeUserRequest>
) {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: InitializeUserRequest) => {
      const response = await client.put<UserData>(
        API_ENDPOINTS.USERS.INITIALIZE, 
        data
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        setUser(response.data);
        invalidateQueries.user();
        
        // 홈으로 이동
        window.location.href = '/home';
      }
    },
    ...options,
  });
}