// 호환성 체크 관련 타입 정의

export interface CompatibilityCheckItem {
  title: string;
  category3: string;
}

export interface CompatibilityCheckRequest {
  items: CompatibilityCheckItem[];
}

export interface CompatibilityCheckDetail {
  result: 'POSITIVE' | 'NEGATIVE' | 'WARNING' | 'UNKNOWN';
  errors: string[];
  warnings: string[];
  details: string;
  check_id: number;
  check_name: string;
  status: 'COMPLETED' | 'ERROR';
}

export type CompatibilityCheckResponse = CompatibilityCheckDetail[];
