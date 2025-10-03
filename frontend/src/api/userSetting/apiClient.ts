import { useTokenStore } from '../../stores/useTokenStore';
import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

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

// API 인터셉터용 토큰 갱신 함수
const refreshTokenForInterceptor = async (): Promise<string | null> => {
  const result = await refreshAccessToken();
  
  if (result.success && result.access_token) {
    return result.access_token;
  }
  
  // 갱신 실패 시 로그인 페이지로 리다이렉트
  if (typeof window !== 'undefined') {
    window.location.href = '/signIn';
  }
  
  return null;
};

// 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { getAccessToken } = useTokenStore.getState();
    const accessToken = getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/oauth/refresh') // 토큰 갱신 API는 제외
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshTokenForInterceptor();

        if (newAccessToken) {
          // 새로운 토큰으로 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('토큰 갱신 중 오류:', refreshError);
      }
    }

    // 토큰 갱신 실패 또는 다른 에러
    if (error.response?.status === 401) {
      const { clearTokens } = useTokenStore.getState();
      clearTokens();
      
      // 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/signIn';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;