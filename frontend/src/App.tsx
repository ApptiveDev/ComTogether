import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import Home from "./pages/home";
import CompatibilityCheck from "./pages/compatibilityCheck";
import ExpertConsultation from "./pages/expertConsultation";
import Guide from "./pages/guide";
import Community from "./pages/community";
import MyPage from "./pages/myPage";
import SignIn from "./pages/signIn";
import Setting from "./pages/setting";
import SecondSetting from "./pages/secondSetting";
import RedirectPage from "./pages/oauth/kakao/RedirectPage";
import ExpertVerifyLayout from "./components/layout/expertVerifyLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import {
  ErrorBoundary,
  GlobalLoader,
  ToastProvider,
} from "./components/providers";
import { queryClient } from "./api/core/query-config";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Navigate to="/signIn" replace />} />
        <Route
          path={"/home"}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/compatibility-check"}
          element={
            <ProtectedRoute>
              <CompatibilityCheck />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/expert-consultation"}
          element={
            <ProtectedRoute>
              <ExpertConsultation />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/guide"}
          element={
            <ProtectedRoute>
              <Guide />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/community"}
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/mypage"}
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route path={"/signIn"} element={<SignIn />} />
        <Route
          path={"/expert-verify"}
          element={
            <ProtectedRoute>
              <ExpertVerifyLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/setting" element={<Setting />} />
        <Route path="/second-setting" element={<SecondSetting />} />
        <Route path={"/oauth/kakao/redirect"} element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router />
        <GlobalLoader />
        <ToastProvider />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
