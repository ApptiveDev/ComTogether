// components/common/ProtectedRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useTokenStore } from "../../stores/useTokenStore"; // 스토어 파일의 실제 경로로 수정해주세요.

// children prop의 타입을 명시해줍니다.
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { accessToken, isTokenExpired } = useTokenStore.getState();

  // 1. accessToken이 있는가?
  // 2. accessToken이 만료되지 않았는가?
  const isAuthenticated = accessToken && !isTokenExpired(accessToken);

  if (!isAuthenticated) {
    // 인증되지 않았다면, 라우터에 설정된 로그인 페이지(/sign-up)로 리디렉션합니다.
    return <Navigate to="/signIn" replace />;
  }

  // 인증되었다면, 감싸고 있던 자식 컴포넌트를 렌더링합니다.
  return <>{children}</>;
};
