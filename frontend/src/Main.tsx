import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./utils/clearAuth"; // 개발 환경에서 전역 함수 등록
import "./utils/debugAuth"; // 인증 디버깅 함수

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
