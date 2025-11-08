import axios from 'axios';
import type { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosRequestConfig,
  InternalAxiosRequestConfig 
} from 'axios';
import { useTokenStore } from '../../stores/useTokenStore';
import type { ApiResponse, RefreshTokenResponse } from '../../types/api';
import { ApiError, HTTP_STATUS } from '../../types/api';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 요청 인터셉터
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const { getAccessToken } = useTokenStore.getState();
    const accessToken = getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }

  private handleRequestError(error: unknown): Promise<never> {
    return Promise.reject(ApiError.fromAxiosError(error));
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private async handleResponseError(error: unknown): Promise<unknown> {
    const axiosError = error as {
      config?: InternalAxiosRequestConfig & { _retry?: boolean };
      response?: { status?: number };
    };

    const originalRequest = axiosError.config;
    const status = axiosError.response?.status;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (
      status === HTTP_STATUS.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await this.handleTokenRefresh();
        
        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return this.client(originalRequest);
        }
      } catch (refreshError) {
        this.redirectToLogin();
        return Promise.reject(ApiError.fromAxiosError(refreshError));
      }
    }

    // 401 에러이고 토큰 갱신이 불가능한 경우
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      this.clearTokensAndRedirect();
    }

    return Promise.reject(ApiError.fromAxiosError(error));
  }

  private async handleTokenRefresh(): Promise<string | null> {
    const { getRefreshToken } = useTokenStore.getState();
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // 이미 토큰 갱신 중인 경우 대기
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token: string) => {
          resolve(token);
        });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {},
        {
          headers: { 'X-Refresh-Token': refreshToken },
          timeout: 5000,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Token refresh failed');
      }

      const { access_token, refresh_token: newRefreshToken } = response.data.data;
      
      // 새로운 토큰 저장
      const { setTokens } = useTokenStore.getState();
      setTokens(access_token, newRefreshToken || refreshToken);

      // 대기 중인 요청들에게 새 토큰 전달
      this.refreshSubscribers.forEach(callback => callback(access_token));
      this.refreshSubscribers = [];

      return access_token;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private clearTokensAndRedirect(): void {
    const { clearTokens } = useTokenStore.getState();
    clearTokens();
    this.redirectToLogin();
  }

  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/signIn';
    }
  }

  // 공통 요청 메서드들
  async get<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = unknown>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = unknown>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // 파일 업로드 전용 메서드
  async uploadFile<T = unknown>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  }

  // raw axios 인스턴스 접근 (필요한 경우)
  get axios(): AxiosInstance {
    return this.client;
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();
export default apiClient;