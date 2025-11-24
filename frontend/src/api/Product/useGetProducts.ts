import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../core/queryConfig';
import { productService } from '../services/productService';
import type { CommonQueryOptions } from '../core/queryConfig';
import type { ProductListResponse, GetProductsParams } from '@/types/product';

/**
 * 제품 검색 API
 * @param params - 검색 파라미터
 * @param options - React Query 옵션
 * @returns 제품 목록 데이터
 */
export function useGetProducts(
  params: GetProductsParams,
  options?: CommonQueryOptions<ProductListResponse>
) {
  return useQuery({
    queryKey: queryKeys.PRODUCTS.SEARCH(params),
    queryFn: async () => {
      const response = await productService.getProducts(params);
      // ApiResponse인 경우 data 추출, 아니면 그대로 반환
      return response.data || response;
    },
    enabled: !!params.category, // category가 있을 때만 실행
    ...options,
  });
}
