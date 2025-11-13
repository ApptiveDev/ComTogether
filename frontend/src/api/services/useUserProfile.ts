import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { apiClient } from '../core/client';
import { 
  queryKeys,
  extractData,
} from '../core/query-config';
import type { CommonQueryOptions } from '../core/query-config';
import { API_ENDPOINTS } from '../core/types';
import type { UserData } from '../../types/user';

// 사용자 프로필 조회
export function useUserProfile(options?: CommonQueryOptions<UserData>) {
  const { updateUserFromApi } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.USER.PROFILE,
    queryFn: async () => {
      const response = await apiClient.get<UserData>(API_ENDPOINTS.USERS.PROFILE);
      
      // 성공 시 스토어에 자동 저장
      if (response.success) {
        updateUserFromApi(response);
      }
      
      return extractData(response);
    },
    ...options,
  });
}