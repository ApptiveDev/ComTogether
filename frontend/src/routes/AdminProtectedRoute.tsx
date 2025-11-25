import { Navigate, Outlet } from "react-router-dom";
import { useTokenStore } from "../stores/useTokenStore";

export const AdminProtectedRoute = () => {
  const { getAccessToken, isTokenExpired } = useTokenStore();

  const accessToken = getAccessToken();

  // 토큰이 없거나 만료되었으면 로그인 페이지로
  if (!accessToken || isTokenExpired(accessToken)) {
    return <Navigate to="/signIn" replace />;
  }

  // TODO: 실제로는 토큰의 role을 확인하여 admin인지 체크해야 함
  // 현재는 토큰이 있으면 접근 허용
  return <Outlet />;
};
