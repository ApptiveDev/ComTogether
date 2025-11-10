// src/types/guide.ts - 가이드 관련 타입 정의

/**
 * API 응답 가이드 데이터 (새로운 형식)
 */
export interface ApiGuideData {
  category: string;
  description: {
    intro: string;
    detail: string;
    caution: string;
    beginner: string;
  };
}

/**
 * 가이드 상세 정보
 */
export interface GuideDetail {
  title: string;
  description: string;
}

/**
 * 가이드 섹션
 */
export interface GuideSection {
  title: string;
  description: string;
  details: GuideDetail[];
}

/**
 * 가이드 데이터 (기존 더미 형식)
 */
export interface GuideData {
  id: number;
  category: string;
  content: GuideSection[];
}

/**
 * 가이드 카테고리 목록
 */
export type GuideCategory = 
  | 'CPU'
  | '메인보드'
  | 'RAM'
  | '그래픽카드'
  | 'SSD'
  | 'HDD'
  | '파워서플라이'
  | '케이스'
  | '쿨러';

/**
 * 가이드 조회 파라미터
 */
export interface GuideQueryParams {
  category?: string;
  page?: number;
  limit?: number;
}

/**
 * 가이드 응답
 */
export interface GuideResponse {
  data: GuideData[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 단일 가이드 응답
 */
export interface SingleGuideResponse {
  data: GuideData;
}
