import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useKakaoLogin } from "@/api/useKakaoLogin";

export default function KakaoRedirectPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { mutation } = useKakaoLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      mutation.mutate(code, {
        onSuccess: () => {
          navigate("/");
        },
        onError: () => {
          alert("로그인에 실패했습니다.");
        },
      });
    }
  }, [code, mutation, navigate]);

  return <div>로그인 처리 중...</div>;
}
