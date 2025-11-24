import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTokenStore } from '../../stores/useTokenStore';
import { useQuoteStore } from '../../stores/useQuoteStore';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';

// 로그아웃
export function useLogout() {
  const { clearAuthState } = useAuthStore();
  const { clearTokens } = useTokenStore();
  const { clearQuote } = useQuoteStore();

  return useMutation({
    mutationFn: async () => {
      try {
        // 서버에 로그아웃 요청
        await client.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        // 서버 요청 실패해도 로컬 정리는 진행
        console.error('서버 로그아웃 실패:', error);
      }
    },
    onMutate: () => {
      // mutation 시작 전에 먼저 정리 (가장 빠른 시점)
      clearTokens();
      clearAuthState();
      clearQuote();
    },
    onSettled: () => {
      // 한 번 더 확실하게 정리
      clearTokens();
      clearAuthState();
      clearQuote();
      
      // localStorage 인증 관련만 삭제
      localStorage.removeItem('token-store');
      localStorage.removeItem('auth-store');
      localStorage.removeItem('quote-store');
      sessionStorage.clear();
      
      // 즉시 리로드 (모든 메모리 상태 초기화)
      setTimeout(() => {
        window.location.href = '/signIn';
      }, 0);
    },
  });
}