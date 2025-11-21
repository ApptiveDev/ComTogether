// src/config/api.ts - API 설정 중앙화
import { ApiError } from '../types/api';

// 환경 변수 검증 및 설정
const requiredEnvVars = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_KAKAO_CLIENT_ID: import.meta.env.VITE_KAKAO_CLIENT_ID,
  VITE_KAKAO_AUTH_URL: import.meta.env.VITE_KAKAO_AUTH_URL,
  VITE_KAKAO_REDIRECT_URI: import.meta.env.VITE_KAKAO_REDIRECT_URI,
} as const;

// 환경 변수 검증
const validateEnvVars = () => {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

// 개발 환경에서만 검증 실행
if (import.meta.env.DEV) {
  validateEnvVars();
}

// API 설정
export const API_CONFIG = {
  baseURL: requiredEnvVars.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000, // 30초
  retryAttempts: 3,
  retryDelay: 1000,
  
  // 카카오 OAuth 설정
  kakao: {
    clientId: requiredEnvVars.VITE_KAKAO_CLIENT_ID || '',
    authUrl: requiredEnvVars.VITE_KAKAO_AUTH_URL || 'https://kauth.kakao.com/oauth/authorize',
    redirectUri: requiredEnvVars.VITE_KAKAO_REDIRECT_URI || '',
  },
} as const;

// API 엔드포인트 상수 (types/api.ts에서 이전)
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    KAKAO_LOGIN: '/oauth/login/kakao',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  
  // 사용자 관련
  USERS: {
    PROFILE: '/users/me',
    INITIALIZE: '/users/initialize',
    DELETE: '/users',
    UPDATE: '/users/me',
    EXPERT_VERIFY: '/users/expert-verify',
  },
  
  // 가이드 관련
  GUIDE: {
    BASE: '/guide',
    BY_CATEGORY: (category: string) => `/guide?category=${category}`,
  },
  
  // 제품 관련
  PRODUCTS: {
    SEARCH: '/products/search',
    RECOMMEND: '/products/recommend',
    DETAILS: (id: string) => `/products/${id}`,
    COMPARE: '/products/compare',
  },
  
  // 커뮤니티 관련
  COMMUNITY: {
    POSTS: '/community/posts',
    POST: (id: string) => `/community/posts/${id}`,
    COMMENTS: (postId: string) => `/community/posts/${postId}/comments`,
    COMMENT: (postId: string, commentId: string) => 
      `/community/posts/${postId}/comments/${commentId}`,
    LIKES: (postId: string) => `/community/posts/${postId}/likes`,
  },
  
  // 챗봇 관련
  CHATBOT: {
    CONVERSATIONS: '/chatbot/conversations',
    CONVERSATION: (id: string) => `/chatbot/conversations/${id}`,
    MESSAGES: (conversationId: string) => 
      `/chatbot/conversations/${conversationId}/messages`,
    SEND_MESSAGE: (conversationId: string) => 
      `/chatbot/conversations/${conversationId}/messages`,
  },

  // 견적서 관련
  QUOTES: {
    BASE: '/quotes',
    DETAIL: (quoteId: number) => `/quotes/${quoteId}`,
  },
  
  // 파일 업로드
  FILES: {
    UPLOAD: '/files/upload',
    AVATAR: '/files/upload/avatar',
    PRODUCT_IMAGE: '/files/upload/product',
  },
  
  // 검색
  SEARCH: {
    GLOBAL: '/search',
    AUTOCOMPLETE: '/search/autocomplete',
    FILTERS: '/search/filters',
  },
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NETWORK: '네트워크 연결을 확인해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  VALIDATION: '입력한 정보를 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
} as const;

// HTTP 상태 코드와 에러 메시지 매핑
export const getErrorMessage = (error: ApiError | Error): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 408:
        return ERROR_MESSAGES.TIMEOUT;
      case 500:
      case 502:
      case 503:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.message || ERROR_MESSAGES.UNKNOWN;
    }
  }
  
  if (ApiError.isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK;
  }
  
  if (ApiError.isTimeoutError(error)) {
    return ERROR_MESSAGES.TIMEOUT;
  }
  
  return error.message || ERROR_MESSAGES.UNKNOWN;
};

// 카카오 로그인 URL 생성 헬퍼
export const createKakaoAuthUrl = (state?: string): string => {
  const params = new URLSearchParams({
    client_id: API_CONFIG.kakao.clientId,
    redirect_uri: API_CONFIG.kakao.redirectUri,
    response_type: 'code',
    ...(state && { state }),
  });
  
  return `${API_CONFIG.kakao.authUrl}?${params.toString()}`;
};

// 리다이렉트 URI 동적 생성 (로컬호스트 대응)
export const getRedirectUri = (): string => {
  if (typeof window === 'undefined') {
    return API_CONFIG.kakao.redirectUri;
  }
  
  const currentOrigin = window.location.origin;
  const isLocalhost = currentOrigin.includes('localhost') || 
                     currentOrigin.includes('127.0.0.1');
  
  // 로컬호스트 환경에서는 환경변수 사용
  if (isLocalhost && API_CONFIG.kakao.redirectUri) {
    return API_CONFIG.kakao.redirectUri;
  }
  
  // 배포 환경에서는 현재 도메인 기준으로 생성
  return `${currentOrigin}/oauth/kakao/redirect`;
};