import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";

export const useKakaoLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const setTokens = useTokenStore((state) => state.setTokens);

    const mutation = useMutation({
        mutationFn: (code: string) =>
            axios.post(
                `${import.meta.env.VITE_API_URL}/auth/kakao`,
                { code }
            ),
        onSuccess: (response) => {
            const { user, accessToken, refreshToken } = response.data;
            setUser(user);
            setTokens(accessToken, refreshToken);
        },
        onError: (error) => {
            console.error("Kakao login error:", error);
        },
    });

    const initiateKakaoLogin = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    return { initiateKakaoLogin, mutation };
}