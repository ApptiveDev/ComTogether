// 1. 경로 수정: 공용 API 타입은 @/types/api에서 가져옵니다.
export type {
  ApiResponse,
  PaginatedApiResponse,
  TokenResponse,
  RefreshTokenResponse,
  FileUploadResponse,
} from '@/types/api';

// 2. 경로 수정: core API 타입은 ./types에서 가져옵니다.
export type { ApiErrorResponse } from './types';

// 3. 경로 수정: API_ENDPOINTS는 re-export하지 않거나, config에서 가져와야 합니다. 여기서는 core 타입만 export.
export { ApiError, HTTP_STATUS } from './types';

// 4. 경로 수정: ./client에서 client 인스턴스를 export 합니다.
export { client, client as default } from './client';