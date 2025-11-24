// 견적 카테고리 상수 정의

export const QUOTE_CATEGORIES = [
  "CPU",
  "메인보드",
  "RAM",
  "그래픽카드",
  "저장장치",
  "파워 서플라이",
  "케이스",
  "쿨러/팬",
  "기타 입출력 장치",
] as const;

export type QuoteCategoryKey = (typeof QUOTE_CATEGORIES)[number];

// API category1 값을 QuoteCategoryKey로 매핑하는 함수
export const mapApiCategoryToQuoteCategory = (
  apiCategory: string
): QuoteCategoryKey | null => {
  // 먼저 QUOTE_CATEGORIES에 직접 포함되어 있는지 확인
  if (QUOTE_CATEGORIES.includes(apiCategory as QuoteCategoryKey)) {
    return apiCategory as QuoteCategoryKey;
  }

  // 매핑 테이블 (네이버 쇼핑 카테고리 등을 우리 카테고리로 변환)
  const mapping: Record<string, QuoteCategoryKey> = {
    "디지털/가전": "기타 입출력 장치", // 임시 매핑
    저장장치: "저장장치",
    "저장 장치": "저장장치",
    파워서플라이: "파워 서플라이",
  };

  return mapping[apiCategory] || null;
};
