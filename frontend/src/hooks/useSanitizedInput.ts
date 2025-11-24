import { useCallback } from 'react';

/**
 * HTML 태그를 제거하고 순수 텍스트만 반환하는 훅
 */
export const useSanitizedInput = () => {
  const sanitize = useCallback((value: string): string => {
    // HTML 태그 제거
    const withoutTags = value.replace(/<[^>]*>/g, '');
    
    // HTML 엔티티 디코딩 (예: &lt; → <, &gt; → >, &amp; → &)
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutTags;
    const decoded = textarea.value;
    
    return decoded;
  }, []);

  return { sanitize };
};
