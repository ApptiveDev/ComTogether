import { useTokenStore } from '@/stores/useTokenStore';

/**
 * 현재 인증 상태를 콘솔에 출력하는 디버깅 함수
 */
export const debugAuthStatus = () => {
  const { getAccessToken, getRefreshToken, isTokenExpired } = useTokenStore.getState();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  console.group('🔐 인증 상태 디버깅');
  
  console.log('Access Token:', {
    exists: !!accessToken,
    preview: accessToken ? `${accessToken.substring(0, 30)}...` : null,
    expired: accessToken ? isTokenExpired(accessToken) : null,
  });

  console.log('Refresh Token:', {
    exists: !!refreshToken,
    preview: refreshToken ? `${refreshToken.substring(0, 30)}...` : null,
    expired: refreshToken ? isTokenExpired(refreshToken) : null,
  });

  // localStorage 확인
  const storedData = localStorage.getItem('token-store');
  console.log('LocalStorage 데이터:', storedData ? JSON.parse(storedData) : null);

  console.groupEnd();
};

// 개발 환경에서 전역 함수로 등록
if (import.meta.env.DEV) {
  (window as Window & { debugAuth?: () => void }).debugAuth = debugAuthStatus;
  console.log('💡 콘솔에서 debugAuth() 실행하여 인증 상태 확인 가능');
}
