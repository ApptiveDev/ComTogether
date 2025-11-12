import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignInLayout from "../components/layout/signInLayout";
import { useAuthStore } from "../stores/useAuthStore";
import { useTokenStore } from "../stores/useTokenStore";

export default function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { getAccessToken } = useTokenStore();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    const token = getAccessToken();

    if (isAuthenticated && token && user) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, user, getAccessToken, navigate]);

  return (
    <>
      <SignInLayout />
    </>
  );
}
