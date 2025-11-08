import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTokenStore } from '../../stores/useTokenStore';
import { apiClient } from '../core/client';
import { 
  queryKeys,
  extractData,
  invalidateQueries 
} from '../core/query-config';
import type { 
  CommonQueryOptions, 
  CommonMutationOptions
} from '../core/query-config';
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
      const response = await apiClient.put<UserData>(
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

// 로그아웃
export function useLogout() {
  const { clearAuthState } = useAuthStore();
  const { clearTokens } = useTokenStore();

  return useMutation({
    mutationFn: async () => {
      try {
        // 서버에 로그아웃 요청
        await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        // 서버 요청 실패해도 로컬 정리는 진행
        console.error('서버 로그아웃 실패:', error);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 로컬 상태 정리
      clearTokens();
      clearAuthState();
      
      // 로컬 스토리지 정리
      localStorage.removeItem('token-store');
      localStorage.removeItem('auth-store');
      
      // 로그인 페이지로 이동
      window.location.href = '/signIn';
    },
  });
}

// 카카오 로그인
interface KakaoLoginRequest {
  code: string;
  redirect_uri: string;
}

interface KakaoLoginResponse {
  access_token: string;
  refresh_token: string;
}

export function useKakaoLogin() {
  const { setTokens } = useTokenStore();
  const { setAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async (data: KakaoLoginRequest) => {
      const response = await apiClient.post<KakaoLoginResponse>(
        API_ENDPOINTS.AUTH.KAKAO_LOGIN,
        data
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { access_token, refresh_token } = response.data;
        setTokens(access_token, refresh_token);
        setAuthenticated(true);
      }
    },
  });
}