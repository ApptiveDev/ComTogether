import { useState } from "react";
import { useLogout } from "../api/services/useLogout";
import { useAuthStore } from "../stores/useAuthStore";
import DeleteAccountModal from "../components/common/deleteAccountModal/DeleteAccountModal";

export default function MyPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();
  const { user } = useAuthStore();

  return (
    <div style={{ padding: "20px" }}>
      <h1>마이페이지</h1>

      {user && (
        <div style={{ marginBottom: "20px" }}>
          <h2>사용자 정보</h2>
          <p>이름: {user.name || "미설정"}</p>
          <p>역할: {user.role || "미설정"}</p>
          <p>이메일: {user.email || "미설정"}</p>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          onClick={() => handleLogout()}
          disabled={isLoggingOut || isDeleteModalOpen}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoggingOut ? "not-allowed" : "pointer",
            opacity: isLoggingOut ? 0.6 : 1,
          }}
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isLoggingOut}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoggingOut ? "not-allowed" : "pointer",
            opacity: isLoggingOut ? 0.6 : 1,
          }}
        >
          계정 삭제
        </button>
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>⚠️ 계정 삭제 시 모든 데이터가 영구적으로 삭제됩니다.</p>
        <p>이 작업은 되돌릴 수 없으니 신중하게 결정해주세요.</p>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
