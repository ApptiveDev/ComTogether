// src/api/userService.ts
import axios from "axios";
import { useTokenStore } from "../stores/useTokenStore";
import type { UserData } from "../types/user";


const API_URL = import.meta.env.VITE_API_URL;

export const fetchUser = async (): Promise<UserData> => {
  const { accessToken } = useTokenStore.getState();

  if (!accessToken) {
    throw new Error("인증 토큰이 없습니다.");
  }

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.data;
};

export const updateUserProfile = async (userData: {
  role: UserData['role'];
  interests?: Array<{ interestId: number; name: string }>;
}) => {
  const { accessToken } = useTokenStore.getState();
  
  console.log('API 요청 데이터:', {
    url: `${API_URL}/users/me`,
    requestData: userData,
    hasToken: !!accessToken,
    tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'null'
  });
  
  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다.');
  }
  
  try {
    const response = await axios.post(`${API_URL}/users/me`, userData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API 응답:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('API 에러 상세:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};