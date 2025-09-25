import type { UserData } from "../types/user";
import { useTokenStore } from "../stores/useTokenStore";
import { useAuthStore } from "../stores/useAuthStore";

interface InitializeUserRequest {
  role: keyof UserRole;
  interest_ids: number[];
}

interface InitializeUserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export const initializeUser = async (userData: InitializeUserRequest): Promise<InitializeUserResponse> => {
  try {
    // 토큰 상태 확인
    const { accessToken } = useTokenStore.getState();
    
    console.log("초기화 API 요청 전 토큰 상태:", {
      hasToken: !!accessToken,
      tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : "없음"
    });
    
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/initialize`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    console.log("초기화 API 응답 상태:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("초기화 API 에러 응답:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: InitializeUserResponse = await response.json();
    console.log("초기화 API 성공 응답:", result);
    
    // 초기화 성공 시 사용자 정보 업데이트
    if (result.success && result.data) {
      const { setUser } = useAuthStore.getState();
      setUser(result.data);
    }
    
    return result;
  } catch (error) {
    console.error('사용자 초기화 실패:', error);
    throw error;
  }
};

// 테스트용 함수
export const testInitializeUser = async () => {
  const testData = {
    role: 'BEGINNER' as keyof UserRole,
    interest_ids: [1, 2, 3]
  };
  
  try {
    const result = await initializeUser(testData);
    console.log('API Test Result:', result);
    return result;
  } catch (error) {
    console.error('API Test Failed:', error);
    throw error;
  }
};