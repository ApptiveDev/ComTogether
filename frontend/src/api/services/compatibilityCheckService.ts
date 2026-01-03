import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { client } from '@/api/core/client';
import type {
  CompatibilityCheckRequest,
  CompatibilityCheckDetail,
  CompatibilityCheckResponse,
} from '@/types/compatibility';
import { useTokenStore } from '@/stores/useTokenStore';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export const compatibilityCheckService = {
  async checkCompatibility(
    data: CompatibilityCheckRequest,
  ): Promise<CompatibilityCheckResponse> {
    const response = await client.post<CompatibilityCheckResponse>(
      API_ENDPOINTS.COMPATIBILITY.CHECK,
      data,
    );

    if (!response.success) {
      throw new Error(response.message || '호환성 체크에 실패했습니다.');
    }

    return response.data;
  },

  /**
   * SSE를 사용한 호환성 체크
   * @param data 체크할 부품 목록
   * @param onResult 각 결과를 받을 때마다 호출되는 콜백
   * @param onComplete 모든 체크가 완료되었을 때 호출되는 콜백
   * @param onError 에러 발생 시 호출되는 콜백
   */
  checkCompatibilityStream: (
    data: CompatibilityCheckRequest,
    onResult: (result: CompatibilityCheckDetail) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) => {
    const { getAccessToken } = useTokenStore.getState();
    const accessToken = getAccessToken();
    const controller = new AbortController();
    const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.COMPATIBILITY.CHECK}`;

    void fetchEventSource(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(data),
      onopen(response) {
        if (!response.ok) {
          throw new Error('호환성 체크 연결에 실패했습니다.');
        }
        console.log('🔗 SSE 연결 성공');
      },
      onmessage(event) {
        if (!event.data) {
          return;
        }

        try {
          if (event.event === 'result') {
            const result: CompatibilityCheckDetail = JSON.parse(event.data);
            console.log('📊 호환성 체크 결과:', result);
            onResult(result);
          } else if (event.event === 'completed') {
            console.log('✅ 호환성 체크 완료');
            controller.abort();
            onComplete();
          } else if (event.event === 'connected') {
            console.log('ℹ️ SSE 상태:', event.data);
          }
        } catch (error) {
          console.error('❌ SSE 메시지 처리 에러:', error);
        }
      },
      onclose() {
        console.log('🔌 SSE 연결 종료');
      },
      onerror(err) {
        controller.abort();
        console.error('❌ SSE 에러:', err);
        onError(
          err instanceof Error
            ? err
            : new Error('호환성 체크 중 오류가 발생했습니다.'),
        );
      },
    });

    return {
      close: () => controller.abort(),
    };
  },
};
