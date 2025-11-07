import { useMutation } from "@tanstack/react-query";
import { useProfileSetupStore } from "../../stores/useProfileSetupStore";
import { useAuthStore } from "../../stores/useAuthStore";
import type { UserData } from "../../types/user";
import apiClient from "./apiClient";

interface InitializeUserRequest {
  role: string;
  interest_ids: number[];
  custom_interests?: string[];
}

interface InitializeUserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export const initialize = async (): Promise<InitializeUserResponse> => {
  const { tempRole, tempInterestIds, tempCustomInterests } = useProfileSetupStore.getState();

  // 유효성 검사
  if (!tempRole) {
    throw new Error("레벨을 선택해주세요.");
  }
  
  if (tempInterestIds.length === 0 && (!tempCustomInterests || tempCustomInterests.length === 0)) {
    throw new Error("관심사를 하나 이상 선택해주세요.");
  }

  const requestBody: InitializeUserRequest = {
    role: tempRole,
    interest_ids: tempInterestIds,
    custom_interests: tempCustomInterests && tempCustomInterests.length > 0 ? tempCustomInterests : undefined,
  };

  try {
    const response = await apiClient.put('/users/initialize', requestBody);
    const result: InitializeUserResponse = response.data;

    // 임시 데이터 클리어 (사용자 정보는 useInitialize에서 처리)
    if (result.success && result.data) {
      const { clearProfileSetup } = useProfileSetupStore.getState();
      clearProfileSetup();
    }

    return result;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || '사용자 초기화에 실패했습니다.');
    }
    
    throw new Error('사용자 초기화에 실패했습니다. 다시 시도해주세요.');
  }
};

// TanStack Query를 사용한 초기화 훅
export const useInitialize = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: initialize,
    onSuccess: (result) => {
      if (result.success && result.data) {
        // 사용자 정보 업데이트 (Zustand persist가 자동으로 localStorage에 저장)
        setUser(result.data);
        
        // 전체 페이지 리로드로 스토어 재초기화 보장
        window.location.href = '/home';
      }
    },
    onError: (error: Error) => {
      console.error('초기화 실패:', error.message);
    },
  });
};