import axios from 'axios';
import { useTokenStore } from '../stores/useTokenStore';

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

/**
 * 독립적인 토큰 갱신 API 함수
 * useAutoLogout 외에도 필요한 곳에서 사용 가능
 */
export const refreshAccessToken = async (): Promise<{ 
  success: boolean; 
  access_token?: string; 
  refresh_token?: string; 
  error?: string 
}> => {
  const { getRefreshToken, setTokens, clearTokens } = useTokenStore.getState();
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return { success: false, error: 'No refresh token available' };
  }

  try {
    console.log('토큰 갱신 API 호출');
    
    const response = await axios.post<RefreshTokenResponse>(
      `${import.meta.env.VITE_API_URL}/refresh`,
      {},
      {
        headers: {
          'X-Refresh-Token': refreshToken
        },
        timeout: 5000
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Token refresh failed');
    }

    const { access_token, refresh_token: newRefreshToken } = response.data.data;
    
    // 새로운 토큰 저장
    setTokens(access_token, newRefreshToken || refreshToken);
    
    console.log('토큰 갱신 성공');
    
    return {
      success: true,
      access_token,
      refresh_token: newRefreshToken || refreshToken
    };
    
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    
    // 401 에러 등 토큰이 완전히 만료된 경우 토큰 클리어
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearTokens();
    }
    
    return { 
      success: false, 
      error: axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'Unknown error occurred'
    };
  }
};