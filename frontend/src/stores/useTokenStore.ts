import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenState {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    isTokenExpired: (token: string) => boolean;
}

export const useTokenStore = create<TokenState>()(
    persist(
        (set, get) => ({
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
                console.log("토큰 클리어");
                set({ accessToken: null, refreshToken: null });
            },
            getAccessToken: () => {
                return get().accessToken;
            },
            getRefreshToken: () => {
                return get().refreshToken;
            },
            isTokenExpired: (token: string) => {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const currentTime = Math.floor(Date.now() / 1000);
                    return payload.exp < currentTime;
                } catch (error) {
                    console.warn('토큰 파싱 실패:', error);
                    return true; // 파싱 실패시 만료된 것으로 간주
                }
            },
        }),
        {
            name: "token-store",
        }
    )
);