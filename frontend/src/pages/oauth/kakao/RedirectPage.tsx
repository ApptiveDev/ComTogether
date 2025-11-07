// frontend/src/pages/oauth/kakao/redirectPage.tsx

import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useKakaoLogin } from "../../../api/userSetting/useKakaoLogin";
import RedirectPageLayout from "../../../components/layout/redirectPageLayout";
import { useAuthStore } from "../../../stores/useAuthStore";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutation: loginMutation } = useKakaoLogin();
  const { isAuthenticated } = useAuthStore();

  const codeProcessed = useRef(false);
  const code = searchParams.get("code");
  const loginSuccessRef = useRef(false);

  useEffect(() => {
    if (code && !codeProcessed.current && !loginMutation.isPending) {
      codeProcessed.current = true;
      loginMutation.mutate(code);
    } else if (!code) {
      navigate("/signIn", { replace: true });
    }
  }, [code, loginMutation, navigate, isAuthenticated]);

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
