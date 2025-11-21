import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import Home from "./pages/Home";
import CompatibilityCheck from "./pages/CompatibilityCheck";
import ExpertConsultation from "./pages/ExpertConsultation";
import Guide from "./pages/Guide";
import Community from "./pages/Community";
import MyPage from "./pages/MyPage";
import SignIn from "./pages/SignIn";
import Setting from "./pages/Setting";
import SecondSetting from "./pages/SecondSetting";
import RedirectPage from "./pages/RedirectPage";
import ExpertVerifyLayout from "./components/layout/ExpertVerifyLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import RootRedirect from "./routes/RootRedirect";
import {
  ErrorBoundary,
  GlobalLoader,
  ToastProvider,
} from "./components/providers";
import { queryClient } from "./api/core/queryConfig";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<RootRedirect />} />
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
