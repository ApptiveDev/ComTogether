import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface HomeProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 홈 페이지 보호 컴포넌트
 * 초기화되지 않은 사용자는 설정 페이지로 리다이렉트
 */
export default function HomeProtectedRoute({
  children,
}: HomeProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 인증되지 않은 사용자는 로그인 페이지로
    if (!isAuthenticated) {
      console.log("🔒 인증되지 않은 사용자 → 로그인 페이지로 이동");
      navigate("/signIn");
      return;
    }

    // 초기화되지 않은 사용자는 설정 페이지로 리다이렉트
    if (user && !user.initialized) {
      console.log("⚙️ 초기화되지 않은 사용자 → 설정 페이지로 이동");
      navigate("/setting");
      return;
    }

    // 초기화된 사용자만 홈 페이지 접근 허용
    console.log("🏠 초기화된 사용자 → 홈 페이지 접근 허용");
  }, [user, isAuthenticated, navigate]);

  // 로딩 중이거나 리다이렉트 중일 때는 아무것도 렌더링하지 않음
  if (!isAuthenticated || (user && !user.initialized)) {
    return null;
  }

  // 초기화된 인증된 사용자만 홈 페이지 렌더링
  return <>{children}</>;
}
