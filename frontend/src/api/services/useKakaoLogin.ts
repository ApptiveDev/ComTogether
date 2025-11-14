import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTokenStore } from '../../stores/useTokenStore';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import { getRedirectUri } from '../../config/api';
import type { UserData } from '../../types/user';

// 카카오 로그인
interface KakaoLoginRequest {
  code: string;
  redirect_uri: string;
}

interface KakaoLoginResponse {
  access_token: string;
  refresh_token: string;
  user?: UserData;
}

export function useKakaoLogin() {
  const { setTokens } = useTokenStore();
  const { setAuthenticated, setUser, clearAuthState } = useAuthStore();
  const { clearTokens } = useTokenStore();

  // 카카오 로그인 페이지로 이동하는 함수
  const initiateKakaoLogin = () => {
    // 로그인 시작 전 기존 인증 정보 완전 제거
    clearTokens();
    clearAuthState();
    localStorage.removeItem("token-store");
    localStorage.removeItem("auth-store");

    const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const REDIRECT_URI = getRedirectUri();

    if (!KAKAO_CLIENT_ID) {
      console.error("KAKAO_CLIENT_ID가 설정되지 않았습니다.");
      alert("카카오 클라이언트 ID가 설정되지 않았습니다. 환경 변수를 확인해주세요.");
      return;
    }

    const kakaoAuthUrl = `${KAKAO_AUTH_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;

    // 카카오 로그인 페이지로 이동
    window.location.href = kakaoAuthUrl;
  };

  const mutation = useMutation({
    mutationFn: async (data: KakaoLoginRequest) => {
      const response = await client.post<KakaoLoginResponse>(
        API_ENDPOINTS.AUTH.KAKAO_LOGIN,
        data
      );
      
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { access_token, refresh_token, user } = response.data;

        // 토큰 저장
        setTokens(access_token, refresh_token);
        
        // 사용자 정보가 있으면 저장
        if (user) {
          setUser(user);
        }
        
        // 인증 상태 업데이트
        setAuthenticated(true);
      }
    },
    onError: (error: Error) => {
      console.error("카카오 로그인 실패:", error);
    },
  });

  return {
    ...mutation,
    initiateKakaoLogin, // 카카오 로그인 시작 함수 추가
  };
}