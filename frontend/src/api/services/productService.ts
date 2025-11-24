import client from '@/api/core';
import { API_ENDPOINTS } from '@/api/core/types';
import type { ProductListResponse, GetProductsParams, GetRecommendedProductsParams } from '@/types/product';

export const productService = {
  /**
   * 제품 검색
   * @param params 검색 파라미터
   */
  getProducts: async (params: GetProductsParams): Promise<ProductListResponse> => {
    const response = await client.get<ProductListResponse>(
      API_ENDPOINTS.PRODUCTS.SEARCH,
      {
        params: {
          category: params.category,
          query: params.query || '',
          display: params.display || 10,
          start: params.start || 1,
          sort: params.sort || 'sim',
          exclude: params.exclude,
        },
      }
    );
    return response.data;
  },

  /**
   * 추천 제품 검색
   * @param params 검색 파라미터
   */
  getRecommendedProducts: async (params: GetRecommendedProductsParams): Promise<ProductListResponse> => {
    const response = await client.get<ProductListResponse>(
      API_ENDPOINTS.PRODUCTS.RECOMMEND,
      {
        params: {
          category: params.category,
          query: params.query || '',
          display: params.display || 10,
          start: params.start || 1,
          sort: params.sort || 'sim',
          exclude: params.exclude,
        },
      }
    );
    return response.data;
  },
};
