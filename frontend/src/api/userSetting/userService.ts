// src/api/userService.ts
import { useTokenStore } from "../../stores/useTokenStore";
import type { UserData } from "../../types/user";
import apiClient from "./apiClient";
import { useQuery } from "@tanstack/react-query";


const API_URL = import.meta.env.VITE_API_URL;

export const useUser = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  })
}

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
    const response = await apiClient.put('/users/me', userData);
    
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