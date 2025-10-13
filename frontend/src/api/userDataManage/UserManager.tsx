// src/components/common/UserManager.tsx
import { useEffect } from "react";
import { useUserManager } from "../../hooks/useUserManager";

/**
 * 전역 사용자 정보 관리 컴포넌트
 * 앱 최상위에서 사용자 정보를 자동으로 관리
 */
export default function UserManager() {
  const { isError, error, shouldFetchUser } = useUserManager();

  useEffect(() => {
    if (shouldFetchUser) {
      console.log("🔄 UserManager: 사용자 정보 자동 조회 시작");
    }

    if (isError && error) {
      console.error("❌ UserManager: 사용자 정보 조회 실패", error);
    }
  }, [shouldFetchUser, isError, error]);
  return null;
}
