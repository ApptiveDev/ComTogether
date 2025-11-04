import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface SettingProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 설정 페이지 보호 컴포넌트
 * 이미 초기화가 완료된 사용자는 설정 페이지에 접근할 수 없도록 보호
 */
export default function SettingProtectedRoute({
  children,
}: SettingProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 인증되지 않은 사용자는 로그인 페이지로
    if (!isAuthenticated) {
      console.log("🔒 인증되지 않은 사용자 → 로그인 페이지로 이동");
      navigate("/signIn");
      return;
    }

    // 이미 초기화가 완료된 사용자는 홈으로 리다이렉트
    if (user && user.initialized) {
      console.log("✅ 이미 초기화된 사용자 → 홈으로 이동");
      navigate("/home");
      return;
    }

    // 초기화되지 않은 사용자만 설정 페이지 접근 허용
    console.log("⚙️ 초기화되지 않은 사용자 → 설정 페이지 접근 허용");
  }, [user, isAuthenticated, navigate]);

  // 로딩 중이거나 리다이렉트 중일 때는 아무것도 렌더링하지 않음
  if (!isAuthenticated || (user && user.initialized)) {
    return null;
  }

  // 초기화되지 않은 인증된 사용자만 설정 페이지 렌더링
  return <>{children}</>;
}
