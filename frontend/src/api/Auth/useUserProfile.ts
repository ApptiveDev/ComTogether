import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { userService } from '../services/userService';
import { 
  queryKeys,
  extractData,
} from '../core/queryConfig';
import type { CommonQueryOptions } from '../core/queryConfig';
import type { UserData } from '../../types/user';

// 사용자 프로필 조회
export function useUserProfile(options?: CommonQueryOptions<UserData>) {
  const { updateUserFromApi } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.USER.PROFILE,
    queryFn: async () => {
      const response = await userService.getUserProfile();
      if (response.success) {
        updateUserFromApi(response);
      }
      
      return extractData(response);
    },
    ...options,
  });
}