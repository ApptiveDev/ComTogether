import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useProfileSetupStore } from "../stores/useProfileSetupStore";

interface SettingProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 설정 페이지 보호 컴포넌트
 * 이미 초기화가 완료된 사용자는 설정 페이지에 접근할 수 없도록 보호
 * 저장된 진행 단계가 있으면 해당 단계로 리다이렉트 (사용자 ID 검증 포함)
 */
export default function SettingProtectedRoute({
  children,
}: SettingProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { currentStep, tempRole, isValidUser, setUserId, clearProfileSetup } =
    useProfileSetupStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }

    if (user && user.initialized) {
      navigate("/home");
      return;
    }

    // 사용자 정보가 있으면 현재 사용자 ID 설정 및 검증
    if (user) {
      const currentUserId = user.userId;

      // 저장된 데이터가 다른 사용자의 것이면 초기화
      if (!isValidUser(currentUserId)) {
        clearProfileSetup();
        setUserId(currentUserId);
        return;
      }

      // 같은 사용자이고 저장된 진행 단계가 있으면 해당 페이지로 리다이렉트
      if (currentStep && window.location.pathname === "/setting") {
        if (currentStep === "expert-verify" && tempRole === "EXPERT") {
          navigate("/expert-verify");
          return;
        } else if (currentStep === "interest-selection") {
          navigate("/second-setting");
          return;
        }
      }
    }
  }, [
    user,
    isAuthenticated,
    currentStep,
    tempRole,
    isValidUser,
    setUserId,
    clearProfileSetup,
    navigate,
  ]);

  // 로딩 중이거나 리다이렉트 중일 때는 아무것도 렌더링하지 않음
  if (!isAuthenticated || (user && user.initialized)) {
    return null;
  }

  // 초기화되지 않은 인증된 사용자만 설정 페이지 렌더링
  return <>{children}</>;
}
