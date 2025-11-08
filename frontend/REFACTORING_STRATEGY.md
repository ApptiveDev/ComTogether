# 리팩터링 단계적 PR 전략

## 📋 PR 분할 계획

### Phase 1: 디자인 시스템 기반 (Priority: High)
- `src/styles/globals/` (CSS 변수, 토큰, 베이스)
- `src/types/common.ts` (UI 컴포넌트 타입)
- 기존 컴포넌트와 독립적이므로 충돌 위험 낮음

### Phase 2: 핵심 타입 시스템 (Priority: High)
- `src/types/api.ts` (API 타입 통합)
- `src/config/api.ts` (API 설정 중앙화)
- `src/api/core/` (ApiClient, 에러 클래스)
- 기존 API 호출 방식 유지하면서 새 시스템 추가

### Phase 3: UI 컴포넌트 개선 (Priority: Medium)
- `src/components/ui/` (Button, Input, Modal 개선)
- `src/components/layout/base/` (BaseLayout, CenteredLayout)
- 기존 컴포넌트와 병행 사용 가능하도록 설계

### Phase 4: 커스텀 훅 시스템 (Priority: Medium)
- `src/hooks/ui/` (useModal, useForm)
- `src/hooks/index.ts`
- `src/stores/useGlobalState.ts`

### Phase 5: API 서비스 통합 (Priority: Low)
- `src/api/services/` (userService 등)
- 기존 API 서비스 점진적 교체

### Phase 6: 성능 최적화 도구 (Priority: Low)
- `src/components/optimized/` (LazyImage, VirtualList)
- `src/components/providers/` (ErrorBoundary, GlobalLoader)
- `src/utils/performance.ts`

## 🚀 실행 방법

각 Phase별로 별도 브랜치를 생성하여 작은 단위로 PR 생성
- `feature/design-system`
- `feature/api-types`
- `feature/ui-components`
- etc...

## ✅ 장점
- 충돌 위험 최소화
- 코드 리뷰 용이성
- 점진적 적용으로 안정성 확보
- 롤백 시 영향 범위 제한