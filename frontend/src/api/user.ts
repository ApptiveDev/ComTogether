import type { UserData } from "../types/user";

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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/initialize`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: InitializeUserResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error initializing user:', error);
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