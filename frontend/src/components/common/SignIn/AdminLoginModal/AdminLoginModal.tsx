import { useState } from "react";
import { useAdminLogin } from "@/api/services/adminService";
import { useTokenStore } from "@/stores/useTokenStore";
import { useNavigate } from "react-router-dom";
import style from "./adminLoginModal.module.css";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
}: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setTokens } = useTokenStore();

  const { mutate: login, isPending } = useAdminLogin({
    onSuccess: (data) => {
      setTokens(data.data.access_token, data.data.refresh_token);
      alert("관리자 로그인 성공!");
      onClose();
      navigate("/admin"); // 관리자 페이지로 이동
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    login({ email, password });
  };

  if (!isOpen) return null;

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <div className={style.header}>
          <h2>관리자 로그인</h2>
          <button className={style.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.inputGroup}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin01@comtogether.com"
              disabled={isPending}
            />
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            className={style.submitButton}
            disabled={isPending}
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
