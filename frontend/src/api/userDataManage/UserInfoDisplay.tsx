// src/components/common/UserInfoDisplay.tsx
import { useAuthStore } from "../../stores/useAuthStore";
import { useUserWithAutoSave } from "../userSetting/userService";

/**
 * 사용자 정보를 표시하고 새로고침할 수 있는 컴포넌트
 */
export default function UserInfoDisplay() {
  const { user, isAuthenticated } = useAuthStore();
  const { refetch, isLoading } = useUserWithAutoSave({ enabled: false });

  const handleRefresh = () => {
    console.log("🔄 사용자 정보 수동 새로고침");
    refetch();
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <p>로그인되지 않음</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        margin: "10px 0",
      }}
    >
      <h3>사용자 정보</h3>
      {user ? (
        <div>
          <p>
            <strong>이름:</strong> {user.name}
          </p>
          <p>
            <strong>이메일:</strong> {user.email}
          </p>
          <p>
            <strong>역할:</strong> {user.role}
          </p>
          <p>
            <strong>포인트:</strong> {user.point}
          </p>
          <p>
            <strong>초기화 완료:</strong> {user.initialized ? "✅" : "❌"}
          </p>
          <p>
            <strong>관심사:</strong> {user.interests?.length || 0}개
          </p>
          {user.interests && user.interests.length > 0 && (
            <ul>
              {user.interests.map((interest) => (
                <li key={interest.interestId}>{interest.name}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>사용자 정보 없음</p>
      )}

      <button
        onClick={handleRefresh}
        disabled={isLoading}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? "새로고침 중..." : "사용자 정보 새로고침"}
      </button>
    </div>
  );
}
