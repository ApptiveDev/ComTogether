import { client as apiClient } from '@/api/core';
import type { GlossaryAutoCompleteResponse, GlossaryDetail, SearchHistoryResponseDto } from '@/types';

export const glossaryService = {
  /**
   * 용어 자동완성 검색
   * @param query 검색 키워드
   * @param size 반환할 결과의 최대 개수 (기본값 5)
   */
  getAutoComplete: async (query: string, size: number = 5) => {
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

      const suggestions = (response.data as GlossaryAutoCompleteResponse)?.suggestions || [];
      
      return suggestions;
    } catch (error) {
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

  /**
   * 검색 기록 조회
   * @param size 조회할 검색 기록 개수 (기본값 30)
   */
  getGlossaryHistory: async (size: number = 30) => {
    console.log('🔍 [Glossary] 검색 기록 조회 요청:', { size });
    try {
      const response = await apiClient.get<SearchHistoryResponseDto>(
        '/glossary/history',
        {
          params: { size },
        }
      );
      console.log('✅ [Glossary] 검색 기록 조회 성공:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [Glossary] 검색 기록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 검색 기록 삭제
   * @param historyId 삭제할 검색 기록 ID
   */
  deleteGlossaryHistory: async (historyId: number) => {
    console.log('🗑️ [Glossary] 검색 기록 삭제 요청:', { historyId });
    try {
      const response = await apiClient.delete<void>(
        `/glossary/history/${historyId}`
      );
      console.log('✅ [Glossary] 검색 기록 삭제 성공:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [Glossary] 검색 기록 삭제 실패:', error);
      throw error;
    }
  },
};