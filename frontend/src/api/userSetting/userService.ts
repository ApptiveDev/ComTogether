// src/api/userService.ts
import { useTokenStore } from "../../stores/useTokenStore";
import { useAuthStore } from "../../stores/useAuthStore";
import type { UserData } from "../../types/user";
import apiClient from "./apiClient";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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

// 사용자 정보를 자동으로 스토어에 저장하는 훅
export const useUserWithAutoSave = (options?: { enabled?: boolean }) => {
  const { updateUserFromApi } = useAuthStore();
  
  const query = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      console.log('🔍 사용자 정보 API 호출: /users/me');
      const response = await apiClient.get('/users/me');
      console.log('📦 사용자 정보 API 응답:', response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  // API 호출 성공 시 자동으로 스토어에 저장
  useEffect(() => {
    if (query.data && query.isSuccess) {
      updateUserFromApi(query.data);
    }
  }, [query.data, query.isSuccess, updateUserFromApi]);

  return query;
}

export const initializeUserProfile = async (userData: {
  role: UserData['role'];
  interest_ids: number[];
  custom_interests?: string[];
}) => {
  const { accessToken } = useTokenStore.getState();
  
  console.log('API 요청 데이터:', {
    url: `${API_URL}/users/initialize`,
    requestData: userData,
    hasToken: !!accessToken,
    tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'null'
  });
  
  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다.');
  }
  
  try {
    const response = await apiClient.put('/users/initialize', userData);
    
    console.log('API 응답:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: unknown } };
      console.error('API 에러 상세:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data
      });
    } else {
      console.error('API 에러:', error);
    }
    throw error;
  }
};

export const deleteUser = async () => {
  const { accessToken } = useTokenStore.getState();
  
  console.log('사용자 삭제 API 호출:', {
    url: `${API_URL}/users`,
    hasToken: !!accessToken,
    tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'null'
  });
  
  if (!accessToken) {
    throw new Error('액세스 토큰이 없습니다.');
  }
  
  try {
    const response = await apiClient.delete('/users');
    
    console.log('사용자 삭제 API 응답:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: unknown } };
      console.error('사용자 삭제 API 에러 상세:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data
      });
    } else {
      console.error('사용자 삭제 API 에러:', error);
    }
    throw error;
  }
};