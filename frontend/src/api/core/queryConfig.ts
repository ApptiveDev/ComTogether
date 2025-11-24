import { 
  QueryClient
} from '@tanstack/react-query';
import type { 
  UseMutationOptions, 
  UseQueryOptions,
  DefaultOptions 
} from '@tanstack/react-query';
import { ApiError } from '../../types/api';
import type { ApiResponse } from '../../types/api';

// 기본 쿼리 옵션
const queryDefaults: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
    retry: (failureCount, error) => {
      // API 에러인 경우 상태 코드에 따라 재시도 결정
      if (error instanceof ApiError) {
        // 4xx 에러는 재시도하지 않음
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
      }
      
      // 네트워크 에러나 5xx 에러는 최대 2번까지 재시도
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  mutations: {
    retry: 1,
    onError: (error) => {
      console.error('Mutation Error:', error);
    },
  },
};

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
  defaultOptions: queryDefaults,
});

// 공통 쿼리 키 팩토리
export const queryKeys = {
  USER: {
    ALL: ['user'] as const,
    PROFILE: ['user', 'me'] as const,
    PROFILE_BY_ID: (id: string) => ['user', 'profile', id] as const,
  },
  
  GUIDE: {
    ALL: ['guide'] as const,
    CATEGORIES: ['guide', 'categories'] as const,
    BY_CATEGORY: (category: string) => ['guide', 'category', category] as const,
    ITEMS: (category?: string) => category ? ['guide', 'items', category] : ['guide', 'items'] as const,
  },

  GLOSSARY: {
    ALL: ['glossary'] as const,
    AUTO_COMPLETE: (query: string) =>
      ['glossary', 'autocomplete', query] as const,
    DETAIL: (query: string) => ['glossary', 'detail', query] as const,
    HISTORY: (size?: number) => 
      size ? ['glossary', 'history', size] : ['glossary', 'history'] as const,
  },

  QUOTES: ['quotes'] as const,
  QUOTE_DETAIL: 'quote-detail' as const,
  
  PRODUCTS: {
    ALL: ['products'] as const,
    SEARCH: (params: Record<string, unknown>) => 
      ['products', 'search', params] as const,
    RECOMMEND: (params: Record<string, unknown>) => 
      ['products', 'recommend', params] as const,
  },
} as const;

// 공통 쿼리 옵션 타입
export type CommonQueryOptions<T> = Omit<
  UseQueryOptions<T, ApiError, T>,
  'queryKey' | 'queryFn'
>;

export type CommonMutationOptions<TData, TVariables> = UseMutationOptions<
  ApiResponse<TData>,
  ApiError,
  TVariables,
  unknown
>;

// 에러 처리 유틸리티
export const handleQueryError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  
  return ApiError.fromAxiosError(error);
};

// 성공 응답 데이터 추출 함수
export const extractData = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new ApiError(response.message || 'API 요청이 실패했습니다.');
  }
  
  return response.data;
};

// 캐시 무효화 헬퍼
export const invalidateQueries = {
  user: () => queryClient.invalidateQueries({ queryKey: queryKeys.USER.ALL }),
  userProfile: () => queryClient.invalidateQueries({ queryKey: queryKeys.USER.PROFILE }),
  guide: (category?: string) => {
    if (category) {
      queryClient.invalidateQueries({ queryKey: queryKeys.GUIDE.ITEMS(category) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.GUIDE.ALL });
    }
  },
  products: () => queryClient.invalidateQueries({ queryKey: queryKeys.PRODUCTS.ALL }),
};

// 프리페치 헬퍼
export const prefetchQueries = {
  userProfile: async () => {
    // 사용자 프로필 프리페치 로직 (필요시 구현)
  },
};