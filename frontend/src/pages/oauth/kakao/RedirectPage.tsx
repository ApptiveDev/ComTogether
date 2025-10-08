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

  useEffect(() => {
    console.log("🔍 RedirectPage 상태:", {
      code: !!code,
      codeProcessed: codeProcessed.current,
      isPending: loginMutation.isPending,
      currentURL: window.location.href,
    });

    if (code && !codeProcessed.current && !loginMutation.isPending) {
      console.log("🚀 로그인 시도 - code:", code);
      codeProcessed.current = true;
      loginMutation.mutate(code);
    } else if (!code) {
      console.error("❌ 인증 코드가 없습니다. URL을 확인해주세요.");
      setTimeout(() => navigate("/signIn"), 3000);
    }
  }, [code, loginMutation, navigate]);

  useEffect(() => {
    if (loginMutation.isError && loginMutation.error) {
      console.error("❌ 로그인 에러:", loginMutation.error);

      const error = loginMutation.error as Error & {
        response?: { data?: unknown; status?: number };
        code?: string;
      };
      console.error("❌ 에러 상세:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });

      // CORS 오류인지 확인
      const isCorsError =
        error?.message?.includes("blocked by CORS") ||
        error?.code === "ERR_NETWORK";

      if (isCorsError) {
        console.warn("🚫 CORS 오류 감지 - 백엔드 설정이 필요합니다");
      }

      setTimeout(() => navigate("/signIn"), 5000); // 5초로 연장
    }
  }, [loginMutation.isError, loginMutation.error, navigate]);

  // 로그인 성공 시 라우팅 처리
  useEffect(() => {
    if (loginMutation.isSuccess && isAuthenticated && !loginMutation.isError) {
      console.log("✅ 로그인 성공! 사용자 정보 조회 후 라우팅 처리");

      // 로그인 성공 후 사용자 정보를 별도로 조회해야 함
      // 잠시 대기 후 사용자 정보 API 호출을 위해 홈으로 이동
      // 홈에서 사용자 정보를 확인하고 초기화 여부에 따라 리다이렉트
      setTimeout(() => {
        navigate("/home");
      }, 1000);
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
