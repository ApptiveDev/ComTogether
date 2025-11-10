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
  category?: string;
  enabled?: boolean;
  useDummy?: boolean;
}

export const useGuideData = (
  options: UseGuideDataOptions = {}
) => {
  const { category, enabled = true } = options;

  return useQuery({
    queryKey: category 
      ? QUERY_KEYS.GUIDE.BY_CATEGORY(category)
      : QUERY_KEYS.GUIDE.ALL,
    
    queryFn: async () => {
      // 실제 API 호출
      if (category) {
        // 카테고리를 소문자로 변환하여 API 호출
        const apiData = await guideService.getGuideByCategory(category.toLowerCase());
        // API 응답을 GuideData 형식으로 변환
        return transformApiGuideData(apiData, 1);
      }
      
      // 모든 카테고리 데이터를 가져오기
      // 백엔드가 모든 카테고리를 반환하는 API가 없으므로 각 카테고리별로 호출
      const categories = ['cpu', 'mainboard', 'ram', 'gpu', 'storage', 'power', 'case', 'cooler'];
      
      const allGuides = await Promise.all(
        categories.map(async (cat, index) => {
          try {
            const apiData = await guideService.getGuideByCategory(cat);
            return transformApiGuideData(apiData, index + 1);
          } catch (error) {
            console.warn(`카테고리 ${cat} 데이터를 불러오는데 실패했습니다:`, error);
            return null;
          }
        })
      );
      
      // null이 아닌 데이터만 필터링하여 반환
      return allGuides.filter((guide): guide is GuideData => guide !== null);
    },
    
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분 (cacheTime에서 변경됨)
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

