// src/api/userSetting/userService.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { apiClient } from "../core/client";
import { ApiError } from "../../types/api";
import type { UserData } from "../../types/user";
import { QUERY_KEYS } from "../../constants/queryKeys";


// 사용자 정보 조회
export const useUser = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: async (): Promise<UserData> => {
      const response = await apiClient.get<UserData>('/users/me');
      return response.data;
    },
    enabled: options?.enabled ?? true,
  });
};

// 사용자 정보를 자동으로 스토어에 저장하는 훅
export const useUserWithAutoSave = (options?: { enabled?: boolean }) => {
  const { updateUserFromApi } = useAuthStore();
  
  const query = useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: async (): Promise<UserData> => {
      const response = await apiClient.get<UserData>('/users/me');
      return response.data;
    },
    enabled: options?.enabled ?? true,
  });

  // API 호출 성공 시 자동으로 스토어에 저장
  useEffect(() => {
    if (query.data && query.isSuccess) {
      updateUserFromApi({ success: true, data: query.data });
    }
  }, [query.data, query.isSuccess, updateUserFromApi]);

  return query;
};

// 사용자 삭제 Mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.delete('/users');
    },
    onSuccess: () => {
      // 사용자 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.ALL });
      // 스토어에서 사용자 정보 제거
      clearUser();
    },
    onError: (error: ApiError) => {
      console.error('사용자 삭제 실패:', error);
    },
  });
};

// Legacy function for backward compatibility
export const deleteUser = async (): Promise<void> => {
  try {
    await apiClient.delete('/users');
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('사용자 삭제에 실패했습니다.', 500);
  }
};