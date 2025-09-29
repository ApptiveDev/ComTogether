// frontend/src/pages/oauth/kakao/RedirectPage.tsx
import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useKakaoLogin } from "../../../api/useKakaoLogin";
import RedirectPageLayout from "../../../components/layout/redirectPageLayout";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutation: loginMutation } = useKakaoLogin();

  const codeProcessed = useRef(false);
  const code = searchParams.get("code");

  useEffect(() => {
    if (code && !codeProcessed.current && !loginMutation.isPending) {
      codeProcessed.current = true;
      loginMutation.mutate(code);
    }
  }, [code, loginMutation]);

  // 에러 발생 시 로그인 페이지로 이동하는 로직만 남김
  useEffect(() => {
    if (loginMutation.isError) {
      setTimeout(() => navigate("/signIn"), 3000);
    }
  }, [loginMutation.isError, navigate]);

  // 로딩 상태 UI만 표시
  return (
    <RedirectPageLayout
      currentStep={loginMutation.isPending ? "authenticating" : "starting"}
      authError={loginMutation.error?.message}
      onRetry={() => navigate("/signIn")}
    />
  );
}
