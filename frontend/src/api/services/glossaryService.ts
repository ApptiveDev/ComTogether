import { client as apiClient } from '@/api/core';
import type { GlossaryAutoCompleteResponse, GlossaryDetail } from '@/types';

export const glossaryService = {
  /**
   * 용어 자동완성 검색
   * @param query 검색 키워드
   * @param size 반환할 결과의 최대 개수 (기본값 5)
   */
  getAutoComplete: async (query: string, size: number = 5) => {
    console.log('🔍 [Glossary] 자동완성 요청:', { query, size });
    try {
      const response = await apiClient.get<GlossaryAutoCompleteResponse>(
        '/glossary/autocomplete',
        {
          params: {
            query,
            size,
          },
        },
      );
      console.log('✅ [Glossary] 자동완성 성공:', response);
      console.log('   - response.data:', response.data);
      console.log('   - response.data type:', typeof response.data);
      
      // response는 ApiResponse 형태: { success, message, data }
      // response.data는 실제 데이터: { suggestions: string[] }
      const suggestions = (response.data as GlossaryAutoCompleteResponse)?.suggestions || [];
      console.log('   - suggestions:', suggestions);
      
      return suggestions;
    } catch (error) {
      console.error('❌ [Glossary] 자동완성 실패:', error);
      // 에러 정보 출력
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: unknown; 
          headers?: Record<string, string> 
        } 
      };
      if (axiosError?.response) {
        console.error('   - 상태 코드:', axiosError.response.status);
        console.error('   - 응답 데이터:', axiosError.response.data);
        console.error('   - 헤더:', axiosError.response.headers);
      }
      throw error;
    }
  },

  /**
   * 용어 상세 조회
   * @param query 용어명 (term)
   */
  getGlossaryDetail: async (query: string) => {
    console.log('🔍 [Glossary] 상세 조회 요청:', { query });
    try {
      const response = await apiClient.get<GlossaryDetail>('/glossary/detail', {
        params: { query },
      });
      console.log('✅ [Glossary] 상세 조회 성공:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [Glossary] 상세 조회 실패:', error);
      throw error;
    }
  },
};