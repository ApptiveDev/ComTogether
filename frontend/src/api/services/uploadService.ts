import { useMutation } from '@tanstack/react-query';
import client from '../core';
import { API_ENDPOINTS } from '../core/types';
import type { CommonMutationOptions } from '../core/queryConfig';

// Presigned URL 요청 타입
export interface PresignedUrlRequest {
  type: string;
  extension: string;
  content_type: string;
}

// Presigned URL 응답 타입
export interface PresignedUrlResponse {
  file_key: string;
  file_url: string;
  upload_url: string;
}

/**
 * Presigned URL 발급
 */
export function useGetPresignedUrl(
  options?: CommonMutationOptions<PresignedUrlResponse, PresignedUrlRequest>
) {
  return useMutation({
    mutationFn: async (data: PresignedUrlRequest) => {
      const response = await client.post<PresignedUrlResponse>(
        API_ENDPOINTS.UPLOAD.PRESIGNED_URL,
        data
      );
      return response.data;
    },
    ...options,
  });
}

/**
 * S3에 파일 직접 업로드
 */
export async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }
}
