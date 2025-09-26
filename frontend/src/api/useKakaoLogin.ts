import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";

export const useKakaoLogin = () => {
    const { setUser, setLoading, setAuthError, isAuthenticated } = useAuthStore();
    const { setTokens } = useTokenStore();

    const mutation = useMutation({
        mutationFn: async (code: string) => {
            // 이미 인증된 상태면 요청하지 않음
            if (isAuthenticated) {
                throw new Error("이미 인증된 상태입니다.");
            }

            console.log("Sending request to:", `${import.meta.env.VITE_API_URL}/oauth/login/kakao`);
            console.log("Request data:", { code });
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/oauth/login/kakao`,
                { code },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000, // 10초 타임아웃
                }
            );
            return response;
        },
        onSuccess: (response) => {
            console.log("Login success:", response.data);
            const data = response.data.data || response.data;
            const { user, access_token, refresh_token } = data;
            
            if (user) setUser(user);
            if (access_token && refresh_token) {
                setTokens(access_token, refresh_token);
            }
            setLoading(false);
        },
        onError: (error: unknown) => {
            console.error("Kakao login error:", error);
            console.error("Error response:", error.response?.data);
            
            let errorMessage = "로그인에 실패했습니다.";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
                errorMessage = "유효하지 않은 인가 코드입니다. 다시 로그인해주세요.";
            } else if (error.response?.status === 401) {
                errorMessage = "인증에 실패했습니다. 다시 시도해주세요.";
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = "서버 연결 시간이 초과되었습니다.";
            }
            
            setAuthError(errorMessage);
            setLoading(false);
        },
    });

    const initiateKakaoLogin = () => {
        // 이미 인증된 상태면 로그인 시도하지 않음
        if (isAuthenticated) {
            console.log("Already authenticated");
            return;
        }

        // 기존 에러 상태 초기화
        setAuthError(null);
        
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;
        console.log("Redirecting to:", kakaoAuthUrl);
        window.location.href = kakaoAuthUrl;
    };

    return { initiateKakaoLogin, mutation };
}