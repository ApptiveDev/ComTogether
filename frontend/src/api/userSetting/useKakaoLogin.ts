// frontend/src/api/useKakaoLogin.ts
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/useAuthStore";
import { useTokenStore } from "../../stores/useTokenStore";
import { useNavigate } from "react-router-dom"; // useNavigate import

export const useKakaoLogin = () => {
    const { setLoading, setAuthError, setAuthenticated } = useAuthStore();
    const { setTokens } = useTokenStore();
    const navigate = useNavigate(); // useNavigate 훅 사용

    const mutation = useMutation({
        mutationFn: async (code: string) => {
            console.log('🔑 카카오 로그인 API 호출');
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/oauth/login/kakao`,
                { code },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000,
                }
            );
            
            return response.data;
        },
        onSuccess: (data) => {
            console.log('✅ 로그인 성공');
            
            const { access_token, refresh_token, user_info } = data.data;
            
            if (access_token && refresh_token) {
                setTokens(access_token, refresh_token);
                setAuthenticated(true);

                // 백엔드에서 보내준 user_info.initialized 값으로 바로 분기 처리
                if (user_info && user_info.initialized) {
                    navigate("/home");
                } else {
                    navigate("/setting");
                }
            }
            setLoading(false);
        },
        onError: (error: unknown) => {
            // Axios 에러 타입 체크
            let errorMessage = "로그인에 실패했습니다.";
            
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response: { data: { message?: string } } };
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                }
            }
            
            console.error('❌ 로그인 실패:', errorMessage);
            
            setAuthError(errorMessage);
            setLoading(false);
        },
    });

    const initiateKakaoLogin = () => {
        setAuthError(null);
        // prompt=login 추가로 강제 재로그인, nonce 추가로 캐시 방지
        const nonce = Date.now();
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code&prompt=login&nonce=${nonce}`;
        window.location.href = kakaoAuthUrl;
    };

    return { initiateKakaoLogin, mutation };
}