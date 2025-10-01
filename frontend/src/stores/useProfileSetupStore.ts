import { create } from "zustand";

interface ProfileSetupState {
  tempRole: string | null;
  tempInterestIds: number[];
  tempCustomInterests: string[];
  setTempRole: (role: string) => void;
  setTempInterestIds: (ids: number[]) => void;
  setTempCustomInterests: (interests: string[]) => void;
  clearProfileSetup: () => void;
}

export const useProfileSetupStore = create<ProfileSetupState>((set) => ({
  tempRole: null,
  tempInterestIds: [],
  tempCustomInterests: [],
  setTempRole: (role) => set({ tempRole: role }),
  setTempInterestIds: (ids) => set({ tempInterestIds: ids }),
  setTempCustomInterests: (interests) => set({ tempCustomInterests: interests }),
  clearProfileSetup: () => set({ tempRole: null, tempInterestIds: [], tempCustomInterests: [] }),
}));