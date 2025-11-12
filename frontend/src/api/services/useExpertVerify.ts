import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../core/client';
import { 
  invalidateQueries 
} from '../core/query-config';
import type { CommonMutationOptions } from '../core/query-config';
import { API_ENDPOINTS } from '../core/types';

// 전문가 인증
interface ExpertVerifyRequest {
  certification?: string;
  portfolio_url?: string;
  certification_file?: File;
}

export function useExpertVerify(
  options?: CommonMutationOptions<void, ExpertVerifyRequest>
) {
  return useMutation({
    mutationFn: async (data: ExpertVerifyRequest) => {
      if (data.certification_file) {
        // 파일이 있는 경우 FormData 사용
        const formData = new FormData();
        formData.append('certification_file', data.certification_file);
        
        if (data.certification) {
          formData.append('certification', data.certification);
        }
        if (data.portfolio_url) {
          formData.append('portfolio_url', data.portfolio_url);
        }

        return apiClient.uploadFile<void>(API_ENDPOINTS.USERS.EXPERT_VERIFY, formData);
      } else {
        // 파일이 없는 경우 JSON 사용
        return apiClient.post<void>(API_ENDPOINTS.USERS.EXPERT_VERIFY, {
          certification: data.certification,
          portfolio_url: data.portfolio_url,
        });
      }
    },
    onSuccess: () => {
      // 프로필 정보 갱신
      invalidateQueries.userProfile();
    },
    ...options,
  });
}