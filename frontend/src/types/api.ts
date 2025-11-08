// src/types/api.ts - 통합 API 타입 정의

// 기본 API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// 에러 응답 타입
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: number;
}

// 페이지네이션 응답 타입
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 페이지네이션 파라미터 타입
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 토큰 관련 타입
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
}

export type RefreshTokenResponse = ApiResponse<TokenResponse>;

// 파일 업로드 응답 타입
export interface FileUploadData {
  url: string;
  filename: string;
  size: number;
  mimetype?: string;
}

export type FileUploadResponse = ApiResponse<FileUploadData>;

// 인증 관련 타입
export interface KakaoLoginResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user: import('./user').UserData;
  };
}

export interface InitializeUserResponse {
  success: boolean;
  data: {
    userId: string;
    isInitialized: boolean;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  data: {
    user: import('./user').UserData;
  };
}

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    KAKAO_LOGIN: '/oauth/login/kakao',
    REFRESH: '/refresh',
    LOGOUT: '/users/logout',
  },
  
  // 사용자 관련
  USERS: {
    PROFILE: '/users/me',
    INITIALIZE: '/users/initialize',
    DELETE: '/users',
    EXPERT_VERIFY: '/users/expert-verify',
  },
  
  // 가이드 관련
  GUIDE: {
    BASE: '/guide',
    CATEGORIES: '/guide/categories',
    ITEMS: '/guide/items',
  },
  
  // 제품 관련
  PRODUCTS: {
    SEARCH: '/products',
    RECOMMEND: '/products/recommend',
  },
  
  // 커뮤니티 관련
  COMMUNITY: {
    BASE: '/community',
    POSTS: '/community/posts',
    POST: (id: string) => `/community/posts/${id}`,
  },
  
  // 챗봇 관련
  CHATBOT: {
    BASE: '/chatbot',
    CONVERSATIONS: '/chatbot/conversations',
    CONVERSATION: (id: string) => `/chatbot/conversations/${id}`,
  },
} as const;

// API 에러 클래스
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public data?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }

  static fromAxiosError(error: unknown): ApiError {
    if (!error || typeof error !== 'object') {
      return new ApiError('Unknown error occurred');
    }

    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
          code?: string;
        };
      };
      message?: string;
      code?: string;
    };

    const status = axiosError.response?.status || 500;
    const message = 
      axiosError.response?.data?.message || 
      axiosError.response?.data?.error || 
      axiosError.message || 
      'API 요청 중 오류가 발생했습니다.';
    const code = axiosError.response?.data?.code || axiosError.code;
    const data = axiosError.response?.data;

    return new ApiError(message, status, code, data);
  }

  static isNetworkError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as { code: string }).code;
      return ['ERR_NETWORK', 'NETWORK_ERROR', 'ECONNREFUSED'].includes(code);
    }
    return false;
  }

  static isTimeoutError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as { code: string }).code;
      return ['ECONNABORTED', 'TIMEOUT'].includes(code);
    }
    return false;
  }
}