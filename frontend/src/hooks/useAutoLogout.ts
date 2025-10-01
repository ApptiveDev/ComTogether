import { useEffect, useCallback, useRef } from 'react';
import { useLogout } from '../api/userSetting/useLogout';
import { useTokenStore } from '../stores/useTokenStore';
import { refreshAccessToken } from '../api/userSetting/apiClient';

interface UseAutoLogoutOptions {
  // 비활성 타임아웃 (기본 30분)
  idleTimeout?: number;
  // 토큰 갱신 시도 간격 (기본 55분 - access token 만료 5분 전)
  refreshInterval?: number;
  // 페이지 숨김 상태에서의 최대 허용 시간 (기본 10분)
  hiddenTimeout?: number;
}

export const useAutoLogout = (options: UseAutoLogoutOptions = {}) => {
  const {
    idleTimeout = 30 * 60 * 1000, // 30분
    refreshInterval = 55 * 60 * 1000, // 55분 (access token 만료 5분 전)
    hiddenTimeout = 10 * 60 * 1000, // 10분
  } = options;

  const { forceLogout } = useLogout();
  const { getAccessToken, getRefreshToken } = useTokenStore();
  
  const idleTimerRef = useRef<NodeJS.Timeout>();
  const refreshTimerRef = useRef<NodeJS.Timeout>();
  const hiddenTimeRef = useRef<number>();

  // 토큰 갱신 함수
  const refreshToken = useCallback(async () => {
    const refreshTokenValue = getRefreshToken();
    
    if (!refreshTokenValue) {
      forceLogout('Refresh token 없음');
      return;
    }

    try {
      console.log('자동 토큰 갱신 시작');
      
      const result = await refreshAccessToken();
      
      if (result.success) {
        console.log('자동 토큰 갱신 성공');
      } else {
        throw new Error(result.error || 'Token refresh failed');
      }
      
    } catch (error) {
      console.error('자동 토큰 갱신 실패:', error);
      forceLogout('토큰 갱신 실패');
    }
  }, [getRefreshToken, forceLogout]);

  // 비활성 타이머 리셋
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      console.log('비활성 상태로 인한 자동 로그아웃');
      forceLogout('비활성 상태 초과');
    }, idleTimeout);
  }, [forceLogout, idleTimeout]);

  // 토큰 갱신 타이머 설정
  const setRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    
    refreshTimerRef.current = setTimeout(() => {
      refreshToken();
      setRefreshTimer(); // 다음 갱신 타이머 설정
    }, refreshInterval);
  }, [refreshToken, refreshInterval]);

  // 페이지 가시성 변경 처리
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // 페이지가 숨겨질 때 시간 기록
      hiddenTimeRef.current = Date.now();
    } else {
      // 페이지가 다시 보일 때 시간 체크
      if (hiddenTimeRef.current) {
        const timeAway = Date.now() - hiddenTimeRef.current;
        
        if (timeAway > hiddenTimeout) {
          console.log('페이지 숨김 시간 초과로 인한 자동 로그아웃');
          forceLogout('페이지 숨김 시간 초과');
          return;
        }
        
        if (timeAway > refreshInterval) {
          // 토큰 갱신이 필요할 수 있음
          refreshToken();
        }
      }
      
      // 활동 타이머 리셋
      resetIdleTimer();
    }
  }, [forceLogout, hiddenTimeout, refreshInterval, refreshToken, resetIdleTimer]);

  // 사용자 활동 감지
  useEffect(() => {
    const events = [
      'mousedown', 
      'mousemove', 
      'keypress', 
      'scroll', 
      'touchstart',
      'click'
    ];

    // 초기 타이머 설정
    resetIdleTimer();
    setRefreshTimer();

    // 이벤트 리스너 등록
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    // 페이지 가시성 변경 감지
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 창 포커스 감지
    window.addEventListener('focus', resetIdleTimer);
    window.addEventListener('blur', handleVisibilityChange);

    return () => {
      // 타이머 정리
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      // 이벤트 리스너 제거
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', resetIdleTimer);
      window.removeEventListener('blur', handleVisibilityChange);
    };
  }, [resetIdleTimer, setRefreshTimer, handleVisibilityChange]);

  // 토큰 상태 체크 (주기적)
  useEffect(() => {
    const checkTokenValidity = () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      // 토큰이 없으면 로그아웃
      if (!accessToken || !refreshToken) {
        forceLogout('토큰 없음');
        return;
      }

      // JWT 토큰 디코딩하여 만료 시간 체크 (옵션)
      try {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenData.exp && tokenData.exp < currentTime) {
          console.log('Access token 만료, 갱신 시도');
          refreshToken();
        }
      } catch (error) {
        console.warn('토큰 파싱 실패:', error);
      }
    };

    // 5분마다 토큰 상태 체크
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);
    
    // 초기 체크
    checkTokenValidity();

    return () => clearInterval(interval);
  }, [getAccessToken, getRefreshToken, forceLogout, refreshToken]);

  return {
    resetIdleTimer,
    refreshToken,
  };
};