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
                            // 숨겨진 iframe으로 카카오 로그아웃 호출
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = `https://kauth.kakao.com/oauth/logout?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
                            document.body.appendChild(iframe);
                            
                            // 3초 후 iframe 제거
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
                    // 서버 로그아웃 실패해도 로컬에서는 로그아웃 진행
                    console.error('❌ 서버 로그아웃 요청 실패:', error);
                }
            }
        },
        onSuccess: () => {
            // 로컬 상태 정리
            clearTokens();
            clearUser();
            
            // 강제로 인증 상태 false로 설정
            const { setAuthenticated } = useAuthStore.getState();
            setAuthenticated(false);
            
            // 모든 타이머 정리 (브라우저 새로고침 효과)
            setTimeout(() => {
                navigate('/signIn');
            }, 100);
        },
        onError: () => {
            // 서버 요청이 실패해도 로컬 상태는 정리
            clearTokens();
            clearUser();
            
            // 강제로 인증 상태 false로 설정
            const { setAuthenticated } = useAuthStore.getState();
            setAuthenticated(false);
            
            setTimeout(() => {
                navigate('/signIn');
            }, 100);
        },
    });

    const logout = (reason?: string) => {
        if (reason) {
            console.log(`로그아웃 사유: ${reason}`);
        }
        mutation.mutate();
    };

    // 즉시 로그아웃 (API 호출 없이)
    const forceLogout = (reason?: string) => {
        if (reason) {
            console.log(`강제 로그아웃 사유: ${reason}`);
        }
        clearTokens();
        clearUser();
        
        // 강제로 인증 상태 false로 설정
        const { setAuthenticated } = useAuthStore.getState();
        setAuthenticated(false);
        
        navigate('/signIn');
    };

    return { 
        logout, 
        forceLogout,
        isLoading: mutation.isPending 
    };
};