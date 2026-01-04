export interface InterestOption {
  id: number;
  label: string;
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: 1, label: '게임' },
  { id: 2, label: '프로그래밍' },
  { id: 3, label: '디자인' },
  { id: 4, label: '영상 편집' },
  { id: 5, label: '음악' },
  { id: 6, label: '사진' },
  { id: 7, label: '3D 모델링' },
  { id: 8, label: '문서 작업' },
  { id: 9, label: '데이터 분석' },
  { id: 10, label: 'AI/머신러닝' },
] as const;

export const normalizeInterestLabel = (label: string): string =>
  label.replace(/\s+/g, '').toLowerCase();

export const INTEREST_LABEL_BY_ID = new Map(
  INTEREST_OPTIONS.map((option) => [option.id, option.label])
);

export const INTEREST_ID_BY_LABEL = new Map(
  INTEREST_OPTIONS.map((option) => [option.label, option.id])
);

export const INTEREST_ID_BY_NORMALIZED_LABEL = new Map(
  INTEREST_OPTIONS.map((option) => [normalizeInterestLabel(option.label), option.id])
);
