import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useLogout = () => {
    const { clearUser } = useAuthStore();
    const { clearTokens, getAccessToken } = useTokenStore();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async () => {
            const accessToken = getAccessToken();
            
            // 서버에 로그아웃 요청 (토큰 무효화)
            if (accessToken) {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/oauth/logout`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 5000,
                    }
                );
            }
        },
        onSuccess: () => {
            // 로컬 상태 정리
            clearTokens();
            clearUser();
            
            // 로그인 페이지로 이동
            navigate('/login');
        },
        onError: () => {
            // 서버 요청이 실패해도 로컬 상태는 정리
            clearTokens();
            clearUser();
            navigate('/login');
        },
    });

    const logout = () => {
        mutation.mutate();
    };

    return { logout, isLoading: mutation.isPending };
};