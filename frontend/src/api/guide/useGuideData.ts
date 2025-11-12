import { useQuery } from '@tanstack/react-query';
import { guideService } from '../services/guideService';
import { QUERY_KEYS } from '../../constants/queryKeys';
import type { GuideData, ApiGuideData } from '../../types/guide';

/**
 * API 응답을 기존 GuideData 형식으로 변환
 */
const transformApiGuideData = (apiData: ApiGuideData, id: number): GuideData => {
  return {
    id,
    category: apiData.category,
    content: [
      {
        title: "개요",
        description: apiData.description.intro || "",
        details: []
      },
      {
        title: "주요 특징",
        description: apiData.description.detail || "",
        details: []
      },
      {
        title: "유의사항",
        description: apiData.description.caution || "",
        details: []
      },
      {
        title: "초보자용 설명",
        description: apiData.description.beginner || "",
        details: []
      }
    ]
  };
};

/**
 * 가이드 데이터 조회 훅 옵션
 */
interface UseGuideDataOptions {
  enabled?: boolean;
}

/**
 * 모든 가이드 카테고리의 데이터를 한 번에 조회
 */
export const useGuideData = (
  options: UseGuideDataOptions = {}
) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: QUERY_KEYS.GUIDE.ALL,
    
    queryFn: async () => {
      // 카테고리 목록 하드코딩
      const categories = ['cpu', 'mainboard', 'ram', 'gpu', 'storage', 'power', 'case', 'cooler'];
      
      const allGuides = await Promise.all(
        categories.map(async (cat, index) => {
          try {
            const apiData = await guideService.getGuideByCategory(cat);
            const transformed = transformApiGuideData(apiData, index + 1);
            return transformed;
          } catch (error) {
            console.warn(`카테고리 ${cat} 데이터를 불러오는데 실패했습니다:`, error);
            return null;
          }
        })
      );
      
      // null이 아닌 데이터만 필터링하여 반환
      const validGuides = allGuides.filter((guide): guide is GuideData => guide !== null);
      
      return validGuides;
    },
    
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
  });
};

export const useGuideCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.GUIDE.CATEGORIES,
    
    queryFn: async () => {
      const categories = ['cpu', 'mainboard', 'ram', 'gpu', 'storage', 'power', 'case', 'cooler'];
      return categories;
    },
    
    staleTime: 1000 * 60 * 10, // 10분
  });
};

export default useGuideData;

