import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, clearUser, setAuthenticated } = useAuthStore();
  const { getAccessToken, getRefreshToken, isTokenExpired } = useTokenStore();

  // 토큰 상태와 인증 상태 동기화
  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    // 토큰이 없으면 인증 상태를 false로 설정
    if (!accessToken || !refreshToken) {
      if (isAuthenticated) {
        setAuthenticated(false);
        clearUser();
      }
      return;
    }

    // access token이 만료되었는지 확인
    if (isTokenExpired(accessToken)) {
      // refresh token도 확인
      if (isTokenExpired(refreshToken)) {
        // 둘 다 만료되었으면 로그아웃
        setAuthenticated(false);
        clearUser();
        return;
      }
      // refresh token이 유효하면 토큰 갱신 필요 (여기서는 일단 통과)
    }

    // 토큰은 있지만 인증 상태가 false인 경우 true로 설정
    if (!isAuthenticated) {
      setAuthenticated(true);
    }
  }, [
    isAuthenticated,
    getAccessToken,
    getRefreshToken,
    isTokenExpired,
    setAuthenticated,
    clearUser,
  ]);

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // 토큰이 없거나 인증되지 않았으면 로그인 페이지로
  if (!isAuthenticated || !accessToken || !refreshToken) {
    return <Navigate to="/signIn" replace />;
  }

  // access token이 만료되었고 refresh token도 만료되었으면 로그인 페이지로
  if (isTokenExpired(accessToken) && isTokenExpired(refreshToken)) {
    return <Navigate to="/signIn" replace />;
  }

  return <>{children}</>;
};
