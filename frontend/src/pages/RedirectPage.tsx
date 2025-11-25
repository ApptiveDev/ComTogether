// frontend/src/pages/oauth/kakao/redirectPage.tsx

import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useKakaoLogin } from "../api/Auth/useKakaoLogin";
import RedirectPageLayout from "../components/layout/RedirectPageLayout";
import { useAuthStore } from "../stores/useAuthStore";
import { getRedirectUri } from "../config/api";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginMutation = useKakaoLogin();
  const { isAuthenticated } = useAuthStore();

  const codeProcessed = useRef(false);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const loginSuccessRef = useRef(false);

  // 카카오 로그인 취소 또는 에러 처리
  useEffect(() => {
    if (error) {
      console.error("카카오 로그인 에러:", error);
      alert("카카오 로그인이 취소되었거나 오류가 발생했습니다.");
      navigate("/signIn", { replace: true });
    }
  }, [error, navigate]);

  useEffect(() => {
    if (code && !codeProcessed.current && !loginMutation.isPending) {
      codeProcessed.current = true;
      const redirect_uri = getRedirectUri();

      loginMutation.mutate({ code, redirect_uri });
    } else if (!code && !error) {
      console.warn("code와 error 둘 다 없음 - 로그인 페이지로 이동");
      navigate("/signIn", { replace: true });
    }
  }, [code, error, loginMutation, navigate, isAuthenticated]);

  useEffect(() => {
    if (loginMutation.isError && loginMutation.error) {
      navigate("/signIn", { replace: true });
    }
  }, [loginMutation.isError, loginMutation.error, navigate]);

  useEffect(() => {
    // isAuthenticated가 true가 되면 바로 이동 (mutation 상태와 무관하게)
    if (isAuthenticated && !loginSuccessRef.current && !loginMutation.isError) {
      loginSuccessRef.current = true;
      navigate("/home", { replace: true });
      return;
    }

    if (loginMutation.isSuccess && !loginMutation.isError) {
      navigate("/home", { replace: true });
    }
  }, [
    loginMutation.isSuccess,
    loginMutation.isError,
    isAuthenticated,
    navigate,
  ]);

  const getStep = () => {
    if (loginMutation.isPending) {
      return "authenticating";
    }
    if (loginMutation.isSuccess && isAuthenticated) {
      return "success";
    }
    if (loginMutation.isError) {
      return "error";
    }
    return "starting";
  };

  const getErrorMessage = () => {
    if (!loginMutation.error) return null;

    const error = loginMutation.error as Error & {
      response?: { data?: unknown; status?: number };
      code?: string;
    };

    if (
      error?.message?.includes("blocked by CORS") ||
      error?.code === "ERR_NETWORK"
    ) {
      return "백엔드 서버에서 CORS 설정이 필요합니다. 잠시 후 로그인 페이지로 이동합니다.";
    }

    return error instanceof Error
      ? error.message
      : "알 수 없는 오류가 발생했습니다.";
  };

  return (
    <RedirectPageLayout
      currentStep={getStep()}
      authError={getErrorMessage()}
      onRetry={() => navigate("/signIn")}
    />
  );
}
