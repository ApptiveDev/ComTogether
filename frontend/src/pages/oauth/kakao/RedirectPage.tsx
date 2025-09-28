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

  // code 처리 로직이 중복 실행되지 않도록 ref 사용
  const codeProcessed = useRef(false);
  const code = searchParams.get("code");

  // 1. URL의 code를 사용하여 로그인(토큰 발급) 요청
  useEffect(() => {
    if (code && !codeProcessed.current && !loginMutation.isPending) {
      codeProcessed.current = true;
      loginMutation.mutate(code);
    }
  }, [code, loginMutation]);

  // 2. 로그인이 성공하여 토큰이 저장되면(isAuthenticated=true), 사용자 정보(/users/me)를 요청
  const {
    data: user,
    isSuccess: userFetchSuccess,
    isError: userFetchError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUser,
    enabled: isAuthenticated && !useAuthStore.getState().user, // 인증되었고, 아직 유저 정보가 스토어에 없을 때만 실행
    retry: false, // 실패 시 재시도 안함
  });

  // 3. 사용자 정보를 성공적으로 가져오면 상태를 저장하고 페이지 이동
  useEffect(() => {
    if (userFetchSuccess && user) {
      setUser(user); // 사용자 정보를 Zustand 스토어에 저장
      // 사용자의 초기 설정 완료 여부에 따라 페이지 이동
      if (user.initialized) {
        navigate("/home");
      } else {
        navigate("/setting");
      }
    }
  }, [userFetchSuccess, user, setUser, navigate]);

  // 4. 로그인 과정에서 에러 발생 시 처리
  useEffect(() => {
    if (loginMutation.isError || userFetchError) {
      setAuthError("로그인에 실패했습니다. 다시 시도해주세요.");
      setTimeout(() => navigate("/sign-up"), 3000); // 3초 후 로그인 페이지로
    }
  }, [loginMutation.isError, userFetchError, setAuthError, navigate]);

  // 현재 진행 단계 결정
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
