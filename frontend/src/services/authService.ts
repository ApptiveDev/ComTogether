import axios from "axios";

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
  const response = await axios.post(`${API_URL}/auth/kakao`, { code });
  return response.data;
};