// src/hooks/useUpdateProfile.ts
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { useTokenStore } from '../stores/useTokenStore';
import type UserData from '../types/user';
import type { UserRoleType } from '../types/user';
interface UpdateProfileRequest {
  role?: UserRoleType;
  interest_ids?: number[];
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export const useUpdateProfile = () => {
    const { user, setUser } = useAuthStore();
    const { accessToken } = useTokenStore();

    const mutation = useMutation({
        mutationFn: async (updateData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
            if (!accessToken) {
                throw new Error('인증 토큰이 없습니다.');
            }

            // 최초 사용자인지 확인 (role이 없거나 interests가 없으면 최초 사용자)
            const isFirstTimeUser = !user?.role || !user?.interests?.length;
            
            console.log("프로필 업데이트:", { isFirstTimeUser, updateData });

            let url = `${import.meta.env.VITE_API_URL}/users/me`;
            let method = 'PATCH';

            // 최초 사용자라면 initialize API 사용
            if (isFirstTimeUser) {
                url = `${import.meta.env.VITE_API_URL}/users/initialize`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("프로필 업데이트 에러:", errorData);
                console.error("요청 URL:", url);
                console.error("요청 데이터:", updateData);
                console.error("응답 상태:", response.status);
                
                // 더 구체적인 에러 메시지 제공
                let errorMessage = `HTTP error! status: ${response.status}`;
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (response.status === 400) {
                    errorMessage = "요청 데이터가 올바르지 않습니다. 다시 시도해주세요.";
                } else if (response.status === 401) {
                    errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
                }
                
                throw new Error(errorMessage);
            }

            const result: UpdateProfileResponse = await response.json();
            
            // 성공 시 사용자 정보 업데이트
            if (result.success && result.data) {
                setUser(result.data);
            }
            
            return result;
        },
        onSuccess: (result) => {
            console.log("프로필 업데이트 성공:", result);
        },
        onError: (error) => {
            console.error("프로필 업데이트 실패:", error);
        }
    });

    return mutation;
};