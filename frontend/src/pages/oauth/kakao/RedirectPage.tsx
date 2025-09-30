// frontend/src/pages/oauth/kakao/RedirectPage.tsx

import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useKakaoLogin } from "../../../api/useKakaoLogin";
import { useAuthStore } from "../../../stores/useAuthStore";
import { fetchUser } from "../../../api/userService";
import RedirectPageLayout from "../../../components/layout/redirectPageLayout";
import type { RedirectStep } from "../../../utils/redirectHelpers";

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutation: loginMutation } = useKakaoLogin();
  const { isAuthenticated, setUser, setAuthError } = useAuthStore();

  const codeProcessed = useRef(false);
  
  // 1. URL에서 'code' 파라미터를 가져옵니다.
  const code = searchParams.get("code");

  // ✨ --- 추가된 로직 --- ✨
  // 페이지가 처음 렌더링될 때 URL의 인가 코드를 확인합니다.
  useEffect(() => {
    if (code) {
      console.log("✅ 카카오 서버로부터 인가 코드를 성공적으로 받았습니다.");
      console.log("인가 코드:", code);
    } else {
      console.error("❌ 카카오 서버로부터 인가 코드를 받지 못했습니다. 카카오 개발자 설정의 Redirect URI를 확인하세요.");
      setAuthError("카카오 인증 코드를 받지 못했습니다.");
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => navigate("/signIn"), 3000); 
    }
  }, [code, navigate, setAuthError]); // code가 변경될 때마다 실행
  // ✨ --- 여기까지 --- ✨

  // 2. URL의 code를 사용하여 로그인(토큰 발급) 요청
  useEffect(() => {
    if (code && !codeProcessed.current && !loginMutation.isPending) {
      console.log("🚀 백엔드 서버로 인가 코드를 전송하여 로그인을 시도합니다.");
      codeProcessed.current = true;
      loginMutation.mutate(code);
    }
  }, [code, loginMutation]);

  // (이하 기존 로직은 동일)
  const {
    data: user,
    isSuccess: userFetchSuccess,
    isError: userFetchError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUser,
    enabled: isAuthenticated && !useAuthStore.getState().user,
    retry: false,
  });

  useEffect(() => {
    if (userFetchSuccess && user) {
      setUser(user);
      if (user.initialized) {
        navigate("/home");
      } else {
        navigate("/setting");
      }
    }
  }, [userFetchSuccess, user, setUser, navigate]);

  useEffect(() => {
    if (loginMutation.isError || userFetchError) {
      setAuthError("로그인에 실패했습니다. 다시 시도해주세요.");
      setTimeout(() => navigate("/signIn"), 3000);
    }
  }, [loginMutation.isError, userFetchError, setAuthError, navigate]);

  const getCurrentStep = (): RedirectStep => {
    if (loginMutation.isError || userFetchError) return "error";
    if (userFetchSuccess && user) return "completed";
    if (isAuthenticated) return "fetchingUser";
    if (loginMutation.isPending) return "authenticating";
    return "starting";
  };

  const currentStep = getCurrentStep();
  const authError = useAuthStore((state) => state.authError);

  return (
    <RedirectPageLayout
      currentStep={currentStep}
      authError={authError}
      onRetry={() => navigate("/signIn")}
    />
  );
}