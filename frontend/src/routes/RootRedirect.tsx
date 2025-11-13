import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";

/**
 * 루트 경로(/)에서 로그인 상태에 따라 적절한 페이지로 리다이렉트
 */
export default function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  const { getAccessToken } = useTokenStore();

  const token = getAccessToken();

  // 로그인되어 있고 토큰이 있으면 홈으로
  if (isAuthenticated && token && user) {
    return <Navigate to="/home" replace />;
  }

  // 아니면 로그인 페이지로
  return <Navigate to="/signIn" replace />;
}
