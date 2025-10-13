// src/hooks/useUserManager.ts
import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useTokenStore } from '../stores/useTokenStore';
import { useUserWithAutoSave } from '../api/userSetting/userService';

/**
 * 전역 사용자 정보 관리 훅
 * 로그인 상태일 때 자동으로 사용자 정보를 조회하고 스토어에 저장
 */
export const useUserManager = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { getAccessToken } = useTokenStore();
  
  // 토큰이 있고 사용자 정보가 없을 때만 API 호출
  const shouldFetchUser = isAuthenticated && !!getAccessToken() && !user;
  
  const {
    isLoading,
    isError,
    error,
    refetch
  } = useUserWithAutoSave({
    enabled: shouldFetchUser,
  });

  // 토큰이 없어졌을 때 사용자 정보 초기화
  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken && user) {
      console.log('🔄 토큰 없음 - 사용자 정보 초기화');
      const { clearAuthState } = useAuthStore.getState();
      clearAuthState();
    }
  }, [getAccessToken, user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    error,
    refetch, // 수동으로 사용자 정보 새로고침
    shouldFetchUser,
  };
};