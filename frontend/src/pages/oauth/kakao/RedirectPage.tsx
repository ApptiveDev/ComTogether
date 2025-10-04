// frontend/src/pages/oauth/kakao/RedirectPage.tsx

import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useKakaoLogin } from "../../../api/userSetting/useKakaoLogin";
import RedirectPageLayout from "../../../components/layout/redirectPageLayout";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useUser } from "../../../api/userSetting/userService";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutation: loginMutation } = useKakaoLogin();
  const { isAuthenticated, setUser } = useAuthStore();

  const codeProcessed = useRef(false);
  const code = searchParams.get("code");

  // 1. 로그인 후 사용자 정보를 가져오는 useUser 훅 (isError 추가)
  const {
    data: userData,
    isSuccess: isUserFetchSuccess,
    isError: isUserFetchError,
  } = useUser({ enabled: isAuthenticated });

  useEffect(() => {
    if (code && !codeProcessed.current && !loginMutation.isPending) {
      console.log("🚀 로그인 시도");
      codeProcessed.current = true;
      loginMutation.mutate(code);
    }
  }, [code, loginMutation, isAuthenticated]);

  useEffect(() => {
    if (loginMutation.isError) {
      console.error("❌ 로그인 에러:", loginMutation.error);
      setTimeout(() => navigate("/signIn"), 3000);
    }
  }, [loginMutation.isError, loginMutation.error, navigate]);

  // 2. 사용자 정보 조회 성공 시의 로직
  useEffect(() => {
    if (isUserFetchSuccess && userData) {
      console.log(
        "✅ 사용자 정보 조회 성공, 이동:",
        userData.initialized ? "home" : "setting"
      );
      setUser(userData);
      if (userData.initialized) {
        navigate("/home");
      } else {
        navigate("/setting");
      }
    }
  }, [isUserFetchSuccess, userData, navigate, setUser]);

  // 3. 사용자 정보 조회 실패 시의 로직
  useEffect(() => {
    if (isUserFetchError) {
      console.log("❌ 사용자 정보 조회 실패 → 설정 페이지로 이동");
      navigate("/setting");
    }
  }, [isUserFetchError, navigate]);

  const getStep = () => {
    if (
      loginMutation.isPending ||
      (isAuthenticated && !isUserFetchSuccess && !isUserFetchError)
    ) {
      return "authenticating";
    }
    return "starting";
  };

  return (
    <RedirectPageLayout
      currentStep={getStep()}
      authError={loginMutation.error?.message}
      onRetry={() => navigate("/signIn")}
    />
  );
}
