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
        mutationFn: async (reason?: string) => {
            if (reason) {
                console.log(`로그아웃 사유: ${reason}`);
            }

            const accessToken = getAccessToken();
            
            // 서버에 로그아웃 요청 (토큰 무효화)
            if (accessToken) {
                try {
                    const response = await axios.post(
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
                    
                    if (response.data.success) {
                        console.log('✅ 서버 로그아웃 성공:', response.data.message);
                        
                        // 카카오 세션은 해제하지 않음 (재로그인 시 기존 사용자로 인식하기 위해)
                        console.log('ℹ️ 카카오 세션은 유지됩니다. 재로그인 시 기존 계정으로 연결됩니다.');
                    } else {
                        console.warn('⚠️ 서버 로그아웃 응답 실패:', response.data);
                    }
                } catch (error) {
                    console.error('❌ 서버 로그아웃 요청 실패:', error);
                }
            }
        },
        onSuccess: () => {
            // 로컬 상태 정리
            clearTokens();
            clearAuthState();
            
            // 로그인 페이지로 이동
            setTimeout(() => {
                navigate('/signIn');
            }, 100);
        },
        onError: () => {
            // 서버 요청이 실패해도 로컬 상태는 정리
            clearTokens();
            clearAuthState();
            
            // 로그인 페이지로 이동
            setTimeout(() => {
                navigate('/signIn');
            }, 100);
        },
    });

    const logout = (reason?: string) => {
        mutation.mutate(reason);
    };

    // 즉시 로그아웃 (API 호출 없이)
    const forceLogout = (reason?: string) => {
        if (reason) {
            console.log(`강제 로그아웃 사유: ${reason}`);
        }
        
        clearTokens();
        clearAuthState();
        navigate('/signIn');
    };

    return { 
        logout, 
        forceLogout,
        isLoading: mutation.isPending 
    };
};