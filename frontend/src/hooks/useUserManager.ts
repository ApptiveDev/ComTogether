// src/hooks/useUserManager.ts
import { useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../stores/useAuthStore';
import { useTokenStore } from '../stores/useTokenStore';
import { useUserWithAutoSave } from '../api/userSetting/userService';
import { apiClient } from "../api/core/client";
import { ApiError } from "../types/api";
import type { KakaoLoginResponse } from "../types/api";
import { getRedirectUri, createKakaoAuthUrl } from "../config/api";
import { QUERY_KEYS } from "../constants/queryKeys";



/**
 * 통합 사용자 관리 훅
 * 사용자 정보 조회, 로그인, 로그아웃, 계정 삭제 등 모든 사용자 관련 기능 제공
 */
export const useUserManager = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, clearAuthState, setLoading, setAuthError, setAuthenticated } = useAuthStore();
  const { setTokens, clearTokens, getAccessToken } = useTokenStore();
  
  // 토큰이 있고 사용자 정보가 없을 때만 API 호출
  const shouldFetchUser = isAuthenticated && !!getAccessToken() && !user;
  
  const userQuery = useUserWithAutoSave({
    enabled: shouldFetchUser,
  });

  // 카카오 로그인
  const kakaoLoginMutation = useMutation({
    mutationFn: async (code: string): Promise<KakaoLoginResponse> => {
      const redirect_uri = getRedirectUri();
      const response = await apiClient.post<KakaoLoginResponse>('/oauth/login/kakao', {
        code,
        redirect_uri,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        const { access_token, refresh_token, user } = data.data;
        
        setTokens(access_token, refresh_token);
        setUser(user);
        setAuthenticated(true);
        
        // 사용자 쿼리 캐시 설정
        queryClient.setQueryData(QUERY_KEYS.USER.PROFILE, user);
      }
      setLoading(false);
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || "로그인에 실패했습니다.";
      setAuthError(errorMessage);
      setLoading(false);
    },
  });

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      const accessToken = getAccessToken();
      
      if (accessToken) {
        try {
          await apiClient.post('/users/logout');
        } catch (error) {
          console.error('서버 로그아웃 요청 실패:', error);
        }
      }
    },
    onSuccess: () => {
      performCleanup();
      navigate('/signIn', { replace: true });
    },
    onError: () => {
      // 서버 요청 실패해도 로컬 정리는 수행
      performCleanup();
      navigate('/signIn', { replace: true });
    },
  });

  // 사용자 삭제
  const deleteUserMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.delete('/users');
    },
    onSuccess: () => {
      performCleanup();
      navigate('/signIn', { replace: true });
    },
    onError: (error: ApiError) => {
      console.error('계정 삭제 실패:', error);
      
      // 401 에러 등 인증 오류인 경우 로그아웃 처리
      if (error.status === 401 || error.message.includes('인증')) {
        performCleanup();
        navigate('/signIn', { replace: true });
      }
    },
  });

  // 공통 정리 함수
  const performCleanup = () => {
    clearTokens();
    clearAuthState();
    queryClient.clear();
    
    // 로컬 스토리지 완전 정리
    localStorage.removeItem('token-store');
    localStorage.removeItem('auth-store');
  };

  // 토큰이 없어졌을 때 사용자 정보 초기화
  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken && user) {
      console.log('🔄 토큰 없음 - 사용자 정보 초기화');
      clearAuthState();
    }
  }, [getAccessToken, user, clearAuthState]);

  // 카카오 로그인 시작
  const initiateKakaoLogin = () => {
    setAuthError(null);
    
    const nonce = Date.now().toString();
    const kakaoAuthUrl = createKakaoAuthUrl(nonce);
    
    window.location.href = kakaoAuthUrl;
  };

  // 카카오 로그인 처리 (리다이렉트 후)
  const handleKakaoLogin = (code: string) => {
    kakaoLoginMutation.mutate(code);
  };

  // 로그아웃
  const logout = () => {
    logoutMutation.mutate();
  };

  // 즉시 로그아웃 (API 호출 없이)
  const forceLogout = () => {
    performCleanup();
    navigate('/signIn', { replace: true });
  };

  // 사용자 삭제 (확인 후)
  const deleteUserAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      deleteUserMutation.mutate();
    }
  };

  return {
    // 사용자 정보
    user,
    isAuthenticated,
    isUserLoading: userQuery.isLoading,
    userError: userQuery.error,
    refetchUser: userQuery.refetch,
    shouldFetchUser,

    // 카카오 로그인
    initiateKakaoLogin,
    handleKakaoLogin,
    isKakaoLoginLoading: kakaoLoginMutation.isPending,
    kakaoLoginError: kakaoLoginMutation.error,

    // 로그아웃
    logout,
    forceLogout,
    isLogoutLoading: logoutMutation.isPending,

    // 사용자 삭제
    deleteUserAccount,
    isDeleteUserLoading: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.error,

    // 공통
    isLoading: userQuery.isLoading || kakaoLoginMutation.isPending || logoutMutation.isPending || deleteUserMutation.isPending,
  };
};