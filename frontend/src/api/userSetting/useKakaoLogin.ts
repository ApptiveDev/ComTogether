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
            console.log('✅ 로그인 성공', data);
            
            const { access_token, refresh_token } = data.data;
            
            if (access_token && refresh_token) {
                setTokens(access_token, refresh_token);
                setAuthenticated(true);
                
                console.log('🔄 토큰 저장 완료');
                console.log('📋 사용자 정보는 HomeProtectedRoute에서 자동으로 조회됩니다');
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
        
        // 환경 변수와 현재 도메인 정보 로깅
        const currentOrigin = window.location.origin;
        const envRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
        const isLocalhost = currentOrigin.includes('localhost');
        
        // 환경별 리다이렉트 URI 결정
        let redirectUri: string;
        if (isLocalhost) {
            redirectUri = envRedirectUri || 'http://localhost:3000/oauth/kakao/redirect';
        } else {
            redirectUri = envRedirectUri || `${currentOrigin}/oauth/kakao/redirect`;
        }
        
        console.log('🌍 현재 도메인:', currentOrigin);
        console.log('⚙️ 환경변수 REDIRECT_URI:', envRedirectUri);
        console.log('✅ 최종 사용할 REDIRECT_URI:', redirectUri);
        
        // prompt=login 추가로 강제 재로그인, nonce 추가로 캐시 방지
        const nonce = Date.now();
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&prompt=login&nonce=${nonce}`;
        
        console.log('🔗 카카오 로그인 URL:', kakaoAuthUrl);
        
        window.location.href = kakaoAuthUrl;
    };

    return { initiateKakaoLogin, mutation };
}