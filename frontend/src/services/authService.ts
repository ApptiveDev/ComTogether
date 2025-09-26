import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";

// 환경변수 사용으로 변경
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_AUTH_URL = import.meta.env.VITE_KAKAO_AUTH_URL;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const API_URL = import.meta.env.VITE_API_URL;

// 카카오 인증 URL 생성
export const getKakaoAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: "code",
  });
  return `${KAKAO_AUTH_URL}?${params.toString()}`;
};

// 백엔드에 인가코드로 로그인 요청
export const signInWithKakao = async (code: string) => {
  const response = await axios.post(`${API_URL}/oauth/login/kakao`, { code });
  return response.data;
};

// 로그아웃 함수
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