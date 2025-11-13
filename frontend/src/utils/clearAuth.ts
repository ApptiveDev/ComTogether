/**
 * 브라우저 콘솔에서 사용할 수 있는 인증 정보 완전 정리 함수
 * 
 * 사용법:
 * 1. 브라우저 개발자 도구 열기 (F12)
 * 2. Console 탭에서 실행:
 *    clearAuthData()
 */

export const clearAuthData = () => {
  console.log("🧹 인증 정보 완전 정리 시작...");
  
  // localStorage 전체 정리
  const beforeKeys = Object.keys(localStorage);
  console.log("📋 정리 전 localStorage 키:", beforeKeys);
  
  // 인증 관련 키만 삭제
  localStorage.removeItem('token-store');
  localStorage.removeItem('auth-store');
  
  // sessionStorage도 정리
  sessionStorage.clear();
  
  const afterKeys = Object.keys(localStorage);
  console.log("📋 정리 후 localStorage 키:", afterKeys);
  
  console.log("✅ 인증 정보 정리 완료!");
  console.log("🔄 페이지를 새로고침하세요.");
  
  return {
    before: beforeKeys,
    after: afterKeys,
    removed: beforeKeys.filter(key => !afterKeys.includes(key))
  };
};

// 전역에 함수 노출 (개발 환경에서만)
if (import.meta.env.DEV) {
  (window as Window & { clearAuthData: typeof clearAuthData }).clearAuthData = clearAuthData;
  console.log("💡 브라우저 콘솔에서 clearAuthData() 함수를 사용할 수 있습니다.");
}
