import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import type { 
  Certification, 
  CertificationGenerateRequest,
  CertificationApproveRequest,
  CertificationRejectRequest 
} from '../../types/api';
import type { CommonQueryOptions, CommonMutationOptions } from '../core/queryConfig';

// ========== 사용자용 API ==========

/**
 * 내 전문가 인증 목록 조회
 */
export function useCertificationGet(
  options?: CommonQueryOptions<Certification[]>
) {
  return useQuery({
    queryKey: ['certification', 'me'],
    queryFn: async () => {
      const response = await client.get<Certification[]>(API_ENDPOINTS.CERTIFICATION.ME);
      return response.data;
    },
    ...options,
  });
}

/**
 * 전문가 인증 생성
 */
export function useCertificationGenerate(
  options?: CommonMutationOptions<void, CertificationGenerateRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CertificationGenerateRequest) => {
      const response = await client.post<void>(API_ENDPOINTS.CERTIFICATION.BASE, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}

/**
 * 전문가 인증 삭제
 */
export function useCertificationDelete(
  options?: CommonMutationOptions<void, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certId: number) => {
      const response = await client.delete<void>(API_ENDPOINTS.CERTIFICATION.DELETE(certId));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}

// ========== 관리자용 API ==========

/**
 * 전문가 인증 전체 목록 조회 (관리자용)
 */
export function useCertificationGetAll(
  options?: CommonQueryOptions<Certification[]>
) {
  return useQuery({
    queryKey: ['certification', 'all'],
    queryFn: async () => {
      const response = await client.get<Certification[]>(API_ENDPOINTS.CERTIFICATION.ALL);
      return response.data;
    },
    ...options,
  });
}

/**
 * 전문가 인증 승인 (관리자용)
 */
export function useCertificationApprove(
  options?: CommonMutationOptions<void, CertificationApproveRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ certId }: CertificationApproveRequest) => {
      const response = await client.patch<void>(API_ENDPOINTS.CERTIFICATION.APPROVE(certId));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}

/**
 * 전문가 인증 거절 (관리자용)
 */
export function useCertificationReject(
  options?: CommonMutationOptions<void, CertificationRejectRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ certId, reason }: CertificationRejectRequest) => {
      const response = await client.patch<void>(`${API_ENDPOINTS.CERTIFICATION.REJECT(certId)}?reason=${encodeURIComponent(reason)}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification'] });
    },
    ...options,
  });
}
