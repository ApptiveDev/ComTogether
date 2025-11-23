import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProfileSetupState {
  userId: number | null;
  tempRole: string | null;
  tempInterestIds: number[];
  tempCustomInterests: string[];
  currentStep: 'role-selection' | 'expert-verify' | 'interest-selection' | null;
  setUserId: (userId: number | null) => void;
  setTempRole: (role: string) => void;
  setTempInterestIds: (ids: number[]) => void;
  setTempCustomInterests: (interests: string[]) => void;
  setCurrentStep: (step: 'role-selection' | 'expert-verify' | 'interest-selection' | null) => void;
  clearProfileSetup: () => void;
  isValidUser: (currentUserId: number | null) => boolean;
}

export const useProfileSetupStore = create<ProfileSetupState>()(
  persist(
    (set, get) => ({
      userId: null,
      tempRole: null,
      tempInterestIds: [],
      tempCustomInterests: [],
      currentStep: null,
      setUserId: (userId) => set({ userId }),
      setTempRole: (role) => set({ tempRole: role }),
      setTempInterestIds: (ids) => set({ tempInterestIds: ids }),
      setTempCustomInterests: (interests) => set({ tempCustomInterests: interests }),
      setCurrentStep: (step) => set({ currentStep: step }),
      clearProfileSetup: () => set({ userId: null, tempRole: null, tempInterestIds: [], tempCustomInterests: [], currentStep: null }),
      isValidUser: (currentUserId) => {
        const state = get();
        // 저장된 userId가 없거나 현재 사용자와 다르면 false
        return state.userId === currentUserId;
      },
    }),
    {
      name: "profile-setup-storage",
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
    }
  )
);