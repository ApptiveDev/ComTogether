import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserData } from "../types/user";

interface AuthState {
    user: UserData | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    authError: string | null;
    setUser: (user: UserData) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
    setAuthError: (error: string | null) => void;
    setAuthenticated: (authenticated: boolean) => void;
    isProfileComplete: () => boolean;
    clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            authError: null,

            setUser: (user) => set({ user, isAuthenticated: true, authError: null }),

            clearUser: () => set({ user: null, isAuthenticated: false, authError: null }),
            
            setLoading: (isLoading) => set({ isLoading }),

            setAuthError: (authError) => set({ authError, isLoading: false }),

            setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

            isProfileComplete: () => {
                const { user } = get();
                if (!user) return false;
                
                return !!(
                    user.role &&
                    user.interests &&
                    user.interests.length > 0
                );
            },

            clearAuthState: () => {
                set({ user: null, isAuthenticated: false, authError: null });
            },
        }),
        {
            name: "auth-store",
            partialize: (state) => ({ 
                user: state.user, 
                isAuthenticated: state.isAuthenticated 
            }),
        }
    )
);

