import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import client from '../core';
import { 
  queryKeys,
  extractData,
} from '../core/queryConfig';
import type { CommonQueryOptions } from '../core/queryConfig';
import { API_ENDPOINTS } from '../core/types';
import type { UserData } from '../../types/user';

// 사용자 프로필 조회
export function useUserProfile(options?: CommonQueryOptions<UserData>) {
  const { updateUserFromApi } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.USER.PROFILE,
    queryFn: async () => {
      const response = await client.get<UserData>(API_ENDPOINTS.USERS.PROFILE);
      
      // 성공 시 스토어에 자동 저장
      if (response.success) {
        updateUserFromApi(response);
      }
      
      return extractData(response);
    },
    ...options,
  });
}