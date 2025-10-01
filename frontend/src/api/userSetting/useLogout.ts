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
                        
                        // 카카오 세션도 해제 (선택적)
                        try {
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = `https://kauth.kakao.com/oauth/logout?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
                            document.body.appendChild(iframe);
                            
                            setTimeout(() => {
                                document.body.removeChild(iframe);
                            }, 3000);
                            
                            console.log('🔄 카카오 세션 해제 요청 완료');
                        } catch (kakaoError) {
                            console.warn('⚠️ 카카오 세션 해제 실패:', kakaoError);
                        }
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