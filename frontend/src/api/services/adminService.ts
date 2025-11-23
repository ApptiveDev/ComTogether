import { useMutation } from '@tanstack/react-query';
import client from '../core';
import type { CommonMutationOptions } from '../core/queryConfig';

// 관리자 로그인 요청 타입
export interface AdminLoginRequest {
  email: string;
  password: string;
}

// 관리자 로그인 응답 타입
export interface AdminLoginResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * 관리자 로그인
 */
export function useAdminLogin(
  options?: CommonMutationOptions<AdminLoginResponse, AdminLoginRequest>
) {
  return useMutation({
    mutationFn: async (data: AdminLoginRequest) => {
      const response = await client.post<AdminLoginResponse>('/users/login', data);
      return response.data;
    },
    ...options,
  });
}
