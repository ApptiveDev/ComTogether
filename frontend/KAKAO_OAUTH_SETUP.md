# 카카오 OAuth 설정 가이드

## 1. 카카오 디벨로퍼스 콘솔 설정

### 앱 설정 → 플랫폼
- **Web 사이트 도메인**: `https://com-together.vercel.app`

### 제품 설정 → 카카오 로그인 → Redirect URI
다음 URI들을 모두 추가:
- `http://localhost:3000/oauth/kakao/redirect` (개발용)
- `https://com-together.vercel.app/oauth/kakao/redirect` (프로덕션)

## 2. Vercel 환경 변수 설정

**Vercel Dashboard → com-together → Settings → Environment Variables**

```
VITE_KAKAO_REDIRECT_URI=https://com-together.vercel.app/oauth/kakao/redirect
```

## 3. 설정 완료 후

1. Vercel에서 재배포
2. 브라우저 개발자 도구 콘솔에서 로그 확인:
   - `🌍 현재 도메인: https://com-together.vercel.app`
   - `✅ 최종 사용할 REDIRECT_URI: https://com-together.vercel.app/oauth/kakao/redirect`

## 4. 문제 해결

만약 여전히 `localhost:3000`으로 리다이렉트된다면:
1. 카카오 콘솔에서 URI가 제대로 등록되었는지 확인
2. Vercel 환경 변수가 제대로 설정되었는지 확인
3. Vercel에서 재배포 실행