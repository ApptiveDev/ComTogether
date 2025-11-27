import { useMutation } from '@tanstack/react-query';
import { compatibilityCheckService } from '../services/compatibilityCheckService';
import type { CompatibilityCheckRequest } from '@/types/compatibility';

export function useCompatibilityCheck() {
  return useMutation({
    mutationFn: (data: CompatibilityCheckRequest) =>
      compatibilityCheckService.checkCompatibility(data),
    onSuccess: (response) => {
      console.log('✅ 호환성 체크 성공:', response);
    },
    onError: (error) => {
      console.error('❌ 호환성 체크 실패:', error);
    },
  });
}
