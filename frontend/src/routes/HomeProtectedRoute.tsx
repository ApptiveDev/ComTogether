import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useUserProfile } from "../api/services/useUserProfile";

interface HomeProtectedRouteProps {
  children: React.ReactNode;
}

export default function HomeProtectedRoute({
  children,
}: HomeProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // 사용자 정보가 없을 때 자동으로 조회하고 스토어에 저장
  const { isLoading, isError } = useUserProfile({
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }

    if (!user && isLoading) {
      return;
    }

    if (!user && isError) {
      navigate("/signIn");
      return;
    }

    if (user && !user.initialized) {
      navigate("/setting");
      return;
    }
  }, [user, isAuthenticated, isLoading, isError, navigate]);

  // 로딩 중이거나 리다이렉트 중일 때는 아무것도 렌더링하지 않음
  if (!isAuthenticated || isLoading || !user || (user && !user.initialized)) {
    return null;
  }

  // 초기화된 인증된 사용자만 홈 페이지 렌더링
  return <>{children}</>;
}
