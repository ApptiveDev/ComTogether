// App.tsx 또는 메인 레이아웃 컴포넌트에서 사용하는 예시

import { useAutoLogout } from "../hooks/useAutoLogout";
import { useAuthStore } from "../stores/useAuthStore";

function AppWithAutoLogout() {
  const { user } = useAuthStore();

  // 로그인된 사용자에게만 자동 로그아웃 적용
  useAutoLogout({
    idleTimeout: 30 * 60 * 1000, // 30분 비활성시 로그아웃
    refreshInterval: 55 * 60 * 1000, // 55분마다 토큰 갱신 시도
    hiddenTimeout: 10 * 60 * 1000, // 10분 이상 페이지 숨김시 로그아웃
  });

  return (
    <div>
      {user ? (
        <div>
          <h1>환영합니다, {user.name}님!</h1>
          <p>자동 로그아웃이 활성화되었습니다.</p>
          <ul>
            <li>30분 비활성 상태시 자동 로그아웃</li>
            <li>55분마다 토큰 자동 갱신</li>
            <li>페이지를 10분 이상 숨김시 로그아웃</li>
            <li>토큰 만료시 자동 갱신 시도</li>
          </ul>
        </div>
      ) : (
        <div>로그인이 필요합니다.</div>
      )}
    </div>
  );
}

export default AppWithAutoLogout;
