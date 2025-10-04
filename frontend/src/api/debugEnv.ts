// 환경변수 확인용
export const debugEnvironment = () => {
    console.log("Environment variables:");
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("VITE_KAKAO_CLIENT_ID:", import.meta.env.VITE_KAKAO_CLIENT_ID);
    console.log("VITE_KAKAO_REDIRECT_URI:", import.meta.env.VITE_KAKAO_REDIRECT_URI);
};