// frontend/src/api/useKakaoLogin.ts
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/useAuthStore";
import { useTokenStore } from "../../stores/useTokenStore";
export const useKakaoLogin = () => {
    const { setLoading, setAuthError, setAuthenticated } = useAuthStore();
    const { setTokens } = useTokenStore();

    const mutation = useMutation({
        mutationFn: async (code: string) => {
            const redirect_uri = `${window.location.origin}/oauth/kakao/redirect`;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/oauth/login/kakao`,
                { code, redirect_uri },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000,
                }
            );

            return response.data;
        },
        onSuccess: (data) => {
            const { access_token, refresh_token } = data.data;
            
            if (access_token && refresh_token) {
                setTokens(access_token, refresh_token);
                setAuthenticated(true);
            } else {
                console.error('토큰이 응답에 없습니다:', data);
            }
            setLoading(false);
        },
        onError: (error: unknown) => {
            let errorMessage = "로그인에 실패했습니다.";
            
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response: { data: { message?: string }; status?: number } };
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                }
            }
            
            setAuthError(errorMessage);
            setLoading(false);
        },
    });

    const initiateKakaoLogin = () => {
        setAuthError(null);
        
        const currentOrigin = window.location.origin;
        const envRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
        const isLocalhost = currentOrigin.includes('localhost');
        
        let redirectUri: string;
        if (isLocalhost) {
            redirectUri = envRedirectUri || 'http://localhost:3000/oauth/kakao/redirect';
        } else {
            redirectUri = envRedirectUri || `${currentOrigin}/oauth/kakao/redirect`;
        }
        
        const nonce = Date.now();
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&prompt=login&nonce=${nonce}`;
        
        window.location.href = kakaoAuthUrl;
    };

    return { initiateKakaoLogin, mutation };
}