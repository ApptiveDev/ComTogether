import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useKakaoLogin } from "../../../api/useKakaoLogin";
import { useAuthStore } from "../../../stores/useAuthStore";

export default function KakaoRedirectPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const { mutation } = useKakaoLogin();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const { isLoading, isAuthenticated, authError, setLoading, setAuthError } =
    useAuthStore();

  useEffect(() => {
    // 이미 처리했거나 로딩 중이면 중복 실행 방지
    if (hasProcessed.current || isLoading) {
      return;
    }

    // 이미 인증된 상태면 홈으로 리다이렉트
    if (isAuthenticated) {
      navigate("/home");
      return;
    }else{
      navigate("/setting");
      return;
    }

    // 에러가 있는 경우 처리
    if (error) {
      console.error("카카오 인증 에러:", error);
      setAuthError("로그인이 취소되었거나 오류가 발생했습니다.");
      hasProcessed.current = true;
      setTimeout(() => navigate("/sign-up"), 2000);
      return;
    }

    // 코드가 있는 경우 로그인 처리
    if (code) {
      hasProcessed.current = true;
      setLoading(true);
      setAuthError(null);

      mutation.mutate(code, {
        onSuccess: (response) => {
          const data = response.data.data || response.data;
          const { user } = data;

          if (user?.initialized) {
            navigate("/");
          } else {
            navigate("/mypage");
          }
        },
        onError: (error) => {
          console.error("로그인 처리 실패:", error);
          const errorMessage =
            error.response?.data?.message ||
            "로그인에 실패했습니다. 다시 시도해주세요.";
          setAuthError(errorMessage);
          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => navigate("/sign-up"), 3000);
        },
      });
    } else {
      // 코드도 에러도 없는 경우
      setAuthError("잘못된 접근입니다.");
      hasProcessed.current = true;
      setTimeout(() => navigate("/sign-up"), 2000);
    }
  }, [
    code,
    error,
    mutation,
    navigate,
    isLoading,
    isAuthenticated,
    setLoading,
    setAuthError,
  ]);

  // 에러 상태 표시
  if (authError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "20px",
        }}
      >
        <div style={{ color: "red", fontSize: "18px" }}>{authError}</div>
        <div style={{ color: "#666" }}>
          잠시 후 로그인 페이지로 이동합니다...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>로그인 처리 중...</div>
    </div>
  );
}
