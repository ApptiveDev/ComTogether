// src/hooks/useUpdateProfile.ts
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { client as apiClient } from '../api/core/client';
import type { UserData } from '../types/user';
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

    const mutation = useMutation({
        mutationFn: async (updateData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
            // 최초 사용자인지 확인 (role이 없거나 interests가 없으면 최초 사용자)
            const isFirstTimeUser = !user?.role || !user?.interests?.length;
            
            console.log("프로필 업데이트:", { isFirstTimeUser, updateData });

            try {
                // 백엔드에서 initialize API만 제공하므로 항상 initialize 사용
                const response = await apiClient.put('/users/initialize', updateData);

                const result = response as UpdateProfileResponse;
                
                // 성공 시 사용자 정보 업데이트
                if (result.success && result.data) {
                    setUser(result.data);
                }
                
                return result;
            } catch (error: unknown) {
                console.error("프로필 업데이트 에러:", error);
                
                // Axios 에러 타입 확인 후 처리
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response: { status: number; data: { message?: string } } };
                    
                    if (axiosError.response?.data?.message) {
                        throw new Error(axiosError.response.data.message);
                    } else if (axiosError.response?.status === 400) {
                        throw new Error("요청 데이터가 올바르지 않습니다. 다시 시도해주세요.");
                    } else if (axiosError.response?.status === 401) {
                        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
                    }
                }
                
                throw new Error("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
            }
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