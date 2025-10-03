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
  
  // 1. URL에서 'code' 파라미터를 가져옵니다.
  const code = searchParams.get("code");


  // 1. 로그인 후 사용자 정보를 가져오는 useUser 훅 (isError 추가)
  const {
    data: userData,
    isSuccess: isUserFetchSuccess,
    isError: isUserFetchError,
  } = useUser({ enabled: isAuthenticated });

  useEffect(() => {
    if (code && !codeProcessed.current && !loginMutation.isPending) {
      console.log("🚀 백엔드 서버로 인가 코드를 전송하여 로그인을 시도합니다.");
      codeProcessed.current = true;
      loginMutation.mutate(code);
    }
  }, [code, loginMutation]);


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

  // 2. 사용자 정보 조회 성공 시의 로직 (기존과 동일)
  useEffect(() => {
    if (isUserFetchSuccess && userData) {
      setUser(userData);
      if (userData.initialized) {
        navigate("/home");
      } else {
        navigate("/setting");
      }
    }
  }, [isUserFetchSuccess, userData, navigate, setUser]);

  // 3. ✨ 사용자 정보 조회 실패 시의 로직 (새로 추가) ✨
  useEffect(() => {
    // 만약 로그인은 성공했는데 사용자 정보 조회가 실패했다면,
    // 아직 초기화가 필요한 신규 사용자일 가능성이 매우 높습니다.
    // 따라서 /setting 페이지로 보내 초기 설정을 유도합니다.
    if (isUserFetchError) {
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