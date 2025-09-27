import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenState {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
}

export const useTokenStore = create<TokenState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            setTokens: (accessToken, refreshToken) => {
                console.log("토큰 저장:", {
                    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
                    refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null
                });
                set({ accessToken, refreshToken });
            },
            clearTokens: () => {
                set({ accessToken: null, refreshToken: null });
            },
        }),
        {
            name: "token-store",
        }
    )
);