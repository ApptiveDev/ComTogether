import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import type { 
  CompatibilityCheckRequest, 
  CompatibilityCheckDetail
} from '@/types/compatibility';
import { useTokenStore } from '@/stores/useTokenStore';

export const compatibilityCheckService = {
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
    
    const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.COMPATIBILITY.CHECK}`;
    
    const eventSource = new EventSource(
      `${url}?${new URLSearchParams({
        items: JSON.stringify(data.items),
      })}${accessToken ? `&token=${accessToken}` : ''}`
    );

    eventSource.addEventListener('connected', (event) => {
      console.log('🔗 SSE 연결:', event.data);
    });

    eventSource.addEventListener('result', (event) => {
      try {
        const result: CompatibilityCheckDetail = JSON.parse(event.data);
        console.log('📊 호환성 체크 결과:', result);
        onResult(result);
      } catch (error) {
        console.error('❌ 결과 파싱 에러:', error);
      }
    });

    eventSource.addEventListener('completed', (event) => {
      console.log('✅ 호환성 체크 완료:', event.data);
      eventSource.close();
      onComplete();
    });

    eventSource.onerror = (error) => {
      console.error('❌ SSE 에러:', error);
      eventSource.close();
      onError(new Error('호환성 체크 중 오류가 발생했습니다.'));
    };

    return eventSource;
  },
};
