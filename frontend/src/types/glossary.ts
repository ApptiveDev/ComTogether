// API 응답 타입 - 백엔드는 String 배열을 반환합니다
export interface GlossaryAutoCompleteResponse {
  suggestions: string[];
}

// 용어 상세 정보 타입
export interface GlossaryDetail {
  name: string;
  description: string;
}

export interface GlossaryDetailResponse {
  name: string;
  description: string;
}