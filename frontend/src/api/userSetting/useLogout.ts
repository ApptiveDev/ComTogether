import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/useAuthStore";
import { useTokenStore } from "../../stores/useTokenStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useLogout = () => {
    const { clearAuthState } = useAuthStore();
    const { clearTokens, getAccessToken } = useTokenStore();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async () => {
            const accessToken = getAccessToken();
            
            // 서버에 로그아웃 요청 (토큰 무효화)
            if (accessToken) {
                try {
                    await axios.post(
                        `${import.meta.env.VITE_API_URL}/users/logout`,
                        {},
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                            timeout: 5000,
                        }
                    );
                } catch (error) {
                    console.error('서버 로그아웃 요청 실패:', error);
                }
            }
        },
        onSuccess: () => {
            // 로컬 상태 정리
            clearTokens();
            clearAuthState();
            
            // 로컬 스토리지 완전 정리
            localStorage.removeItem('token-store');
            localStorage.removeItem('auth-store');
            
            // 로그인 페이지로 이동
            navigate('/signIn', { replace: true });
        },
        onError: () => {
            // 서버 요청이 실패해도 로컬 상태는 정리
            clearTokens();
            clearAuthState();
            
            // 로컬 스토리지 완전 정리
            localStorage.removeItem('token-store');
            localStorage.removeItem('auth-store');
            
            // 로그인 페이지로 이동
            navigate('/signIn', { replace: true });
        },
    });

    const logout = () => {
        mutation.mutate();
    };

    // 즉시 로그아웃 (API 호출 없이)
    const forceLogout = () => {
        clearTokens();
        clearAuthState();
        
        // 로컬 스토리지 완전 정리
        localStorage.removeItem('token-store');
        localStorage.removeItem('auth-store');
        
        navigate('/signIn', { replace: true });
    };

    return { 
        logout, 
        forceLogout,
        isLoading: mutation.isPending 
    };
};