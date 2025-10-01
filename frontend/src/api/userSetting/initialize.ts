import { useProfileSetupStore } from "../../stores/useProfileSetupStore";
import { useTokenStore } from "../../stores/useTokenStore";
import { useAuthStore } from "../../stores/useAuthStore";
import type { UserData } from "../../types/user";

interface InitializeUserRequest {
  role: string;
  interest_ids: number[];
  custom_interests?: string[];
}

interface InitializeUserResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export const initialize = async (): Promise<InitializeUserResponse> => {
  const { tempRole, tempInterestIds, tempCustomInterests } = useProfileSetupStore.getState();
  const { accessToken } = useTokenStore.getState();

  if (!accessToken) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }
  if (!tempRole || (tempInterestIds.length === 0 && (!tempCustomInterests || tempCustomInterests.length === 0))) {
    throw new Error("레벨과 관심사 또는 맞춤 관심사를 하나 이상 선택해주세요.");
  }

  const requestBody: InitializeUserRequest = {
    role: tempRole,
    interest_ids: tempInterestIds,
    custom_interests: tempCustomInterests && tempCustomInterests.length > 0 ? tempCustomInterests : undefined,
  };

  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/initialize`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result: InitializeUserResponse = await response.json();

  if (result.success && result.data) {
    const { setUser } = useAuthStore.getState();
    setUser(result.data);
  }

  return result;
};