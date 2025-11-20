import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";
import { client as apiClient } from "../api/core/client";
import { ApiError } from "../types/api";
import type { KakaoLoginResponse } from "../types/api";
import { createKakaoAuthUrl } from "../config/api";
import { QUERY_KEYS } from "../constants/queryKeys";

// 카카오 인증 URL 생성 (설정 파일에서 가져옴)
export const getKakaoAuthUrl = createKakaoAuthUrl;

// 카카오 로그인 훅
export const useKakaoLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { setTokens } = useTokenStore();

  return useMutation({
    mutationFn: async (code: string): Promise<KakaoLoginResponse> => {
      const response = await apiClient.post<KakaoLoginResponse>('/oauth/login/kakao', { code });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        const { access_token, refresh_token, user } = data.data;
        
        // 토큰과 사용자 정보 저장
        setTokens(access_token, refresh_token);
        setUser(user);
        
        // 사용자 쿼리 캐시 설정
        queryClient.setQueryData(QUERY_KEYS.USER.PROFILE, user);
      }
    },
    onError: (error: ApiError) => {
      console.error('카카오 로그인 실패:', error);
    },
  });
};

// 로그아웃 훅
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();
  const { clearTokens } = useTokenStore();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      // 서버에 로그아웃 요청 (토큰 무효화)
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      // 로컬 상태 정리
      clearUser();
      clearTokens();
      
      // 쿼리 캐시 정리
      queryClient.clear();
      
      // 로컬 스토리지 완전 정리
      localStorage.removeItem('auth-store');
      localStorage.removeItem('token-store');
    },
    onError: (error) => {
      // 서버 로그아웃 실패해도 로컬 정리는 수행
      console.warn('서버 로그아웃 실패, 로컬 정리만 수행:', error);
      clearUser();
      clearTokens();
      queryClient.clear();
      localStorage.removeItem('auth-store');
      localStorage.removeItem('token-store');
    },
    onSettled: () => {
      // 성공/실패 관계없이 로그인 페이지로 이동
      window.location.href = '/signIn';
    },
  });
};

// 레거시 함수들 (기존 코드와의 호환성)
export const signInWithKakao = async (code: string): Promise<KakaoLoginResponse> => {
  try {
    const response = await apiClient.post<KakaoLoginResponse>('/oauth/login/kakao', { code });
    return response.data;
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('카카오 로그인에 실패했습니다.', 500);
  }
};

export const logout = () => {
  const { clearUser } = useAuthStore.getState();
  const { clearTokens } = useTokenStore.getState();
  
  clearUser();
  clearTokens();
  
  // 로컬 스토리지 완전 정리
  localStorage.removeItem('auth-store');
  localStorage.removeItem('token-store');
  
  // 홈페이지로 리다이렉트
  window.location.href = '/';
};