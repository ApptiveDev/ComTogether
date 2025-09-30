// frontend/src/api/useKakaoLogin.ts
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";
import { useNavigate } from "react-router-dom"; // useNavigate import

export const useKakaoLogin = () => {
    const { setLoading, setAuthError, setAuthenticated } = useAuthStore();
    const { setTokens } = useTokenStore();
    const navigate = useNavigate(); // useNavigate 훅 사용

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
            // 백엔드 응답에 사용자 정보가 포함되어 있는지 확인해야 합니다.
            // 만약 포함되어 있지 않다면, 이 방식은 사용할 수 없습니다.
            // 현재 코드에서는 `initialized` 정보가 없으므로, 아래 로직 대신 기존 방식을 유지해야 합니다.
            // 하지만 이상적으로는 로그인 응답에 initialized 여부가 포함되어야 합니다.
            return response.data;
        },
        onSuccess: (data) => {
            const { access_token, refresh_token, user_info } = data.data; // 백엔드 응답에 user_info가 있다고 가정
            
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
        onError: (error) => {
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
        // prompt=login 추가로 강제 재로그인, nonce 추가로 캐시 방지
        const nonce = Date.now();
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code&prompt=login&nonce=${nonce}`;
        window.location.href = kakaoAuthUrl;
    };

    return { initiateKakaoLogin, mutation };
}