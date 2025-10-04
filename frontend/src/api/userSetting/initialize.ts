import { useMutation } from "@tanstack/react-query";
import { useProfileSetupStore } from "../../stores/useProfileSetupStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
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

  console.log('🚀 사용자 초기화 요청:', requestBody);

  try {
    const response = await apiClient.put('/users/initialize', requestBody);
    const result: InitializeUserResponse = response.data;

    console.log('✅ 사용자 초기화 성공:', result);

    // 초기화 성공 시 사용자 정보 업데이트
    if (result.success && result.data) {
      const { setUser } = useAuthStore.getState();
      setUser(result.data);
      
      // 임시 데이터 클리어
      const { clearProfileSetup } = useProfileSetupStore.getState();
      clearProfileSetup();
    }

    return result;
  } catch (error: unknown) {
    console.error(' 사용자 초기화 실패:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || '사용자 초기화에 실패했습니다.');
    }
    
    throw new Error('사용자 초기화에 실패했습니다. 다시 시도해주세요.');
  }
};

// TanStack Query를 사용한 초기화 훅
export const useInitialize = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: initialize,
    onSuccess: (result) => {
      console.log('🎉 초기화 완료, 홈으로 이동');
      
      // 사용자 정보가 확실히 업데이트되었는지 확인
      if (result.success && result.data) {
        console.log('✅ 사용자 정보 업데이트 확인:', result.data.initialized);
      }
      
      // 잠시 후 홈으로 이동 (상태 업데이트가 완료될 시간 확보)
      setTimeout(() => {
        navigate('/home');
      }, 100);
    },
    onError: (error: Error) => {
      console.error('💥 초기화 실패:', error.message);
      // 에러는 UI에서 처리하도록 전파
    },
  });
};