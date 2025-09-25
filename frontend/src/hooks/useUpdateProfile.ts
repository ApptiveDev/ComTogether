// src/hooks/useUpdateProfile.ts
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { useTokenStore } from '../stores/useTokenStore';

interface UpdateProfileRequest {
  role?: keyof UserRole;
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
                throw new Error(`HTTP error! status: ${response.status}`);
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