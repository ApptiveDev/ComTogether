import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/useAuthStore";
import { useTokenStore } from "../../stores/useTokenStore";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "./userService";

export const useDeleteUser = () => {
    const { clearAuthState } = useAuthStore();
    const { clearTokens } = useTokenStore();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: (data) => {
            console.log('✅ 사용자 삭제 성공:', data);
            
            // 로컬 상태 정리
            clearTokens();
            clearAuthState();
            
            // 삭제 완료 후 로그인 페이지로 이동
            setTimeout(() => {
                navigate('/signIn');
            }, 100);
        },
        onError: (error: Error) => {
            console.error('❌ 사용자 삭제 실패:', error.message);
            
            // 401 에러 등 인증 오류인 경우 로그아웃 처리
            if (error.message.includes('401') || error.message.includes('인증')) {
                clearTokens();
                clearAuthState();
                navigate('/signIn');
            }
        },
    });

    const deleteUserAccount = () => {
        // 사용자 확인 후 삭제 실행
        if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            mutation.mutate();
        }
    };

    return { 
        deleteUserAccount, 
        isLoading: mutation.isPending,
        error: mutation.error
    };
};