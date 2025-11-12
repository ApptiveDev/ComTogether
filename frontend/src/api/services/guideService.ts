// src/api/services/guideService.ts - 가이드 API 서비스

import { apiClient } from '../core';
import { API_ENDPOINTS } from '../../config/api';
import type { 
  GuideQueryParams,
  ApiGuideData
} from '../../types/guide';
import type { ApiResponse } from '../../types/api';

/**
 * 가이드 서비스 클래스
 */
class GuideService {
  async getAllGuides(params?: GuideQueryParams): Promise<ApiGuideData[]> {
    const response = await apiClient.get<ApiResponse<ApiGuideData[]>>(
      API_ENDPOINTS.GUIDE.BASE,
      { params }
    );
    return response.data.data;
  }

  /**
   * 카테고리별 가이드 데이터 조회
   * @param category - 가이드 카테고리 (cpu, mainboard, ram 등)
   */
  async getGuideByCategory(category: string): Promise<ApiGuideData> {
    const response = await apiClient.get<ApiGuideData>(
      API_ENDPOINTS.GUIDE.BASE,
      { 
        params: { category } 
      }
    );
    return response.data;
  }

  /**
   * 가이드 카테고리 목록 조회
   */
  async getGuideCategories(): Promise<string[]> {
    // 고정된 카테고리 목록 반환
    return ['cpu', 'mainboard', 'ram', 'gpu', 'storage', 'power', 'case', 'cooler'];
  }
}

export const guideService = new GuideService();
