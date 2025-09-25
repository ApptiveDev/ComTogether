// frontend/src/api/useKakaoLogin.ts
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";

export const useKakaoLogin = () => {
    // setUser 대신 setAuthenticated를 사용해 인증 상태만 변경
    const { setLoading, setAuthError, setAuthenticated } = useAuthStore();
    const { setTokens } = useTokenStore();

    const mutation = useMutation({
        mutationFn: async (code: string) => {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/oauth/login/kakao`,
                { code },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000,
                }
            );
            return response.data; // response.data를 직접 반환
        },
        onSuccess: (data) => {
            // 백엔드가 { success, message, data } 형식으로 감싸서 보내므로 실제 데이터는 data.data에 있습니다.
            const { access_token, refresh_token } = data.data;
            
            if (access_token && refresh_token) {
                // 토큰 저장 및 인증 상태 true로 변경
                setTokens(access_token, refresh_token);
                setAuthenticated(true);
            }
            setLoading(false);
        },
        onError: (error: any) => { // 타입을 any로 변경하여 유연하게 처리
            let errorMessage = "로그인에 실패했습니다.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            setAuthError(errorMessage);
            setLoading(false);
        },
    });

    const initiateKakaoLogin = () => {
        setAuthError(null);
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    return { initiateKakaoLogin, mutation };
}