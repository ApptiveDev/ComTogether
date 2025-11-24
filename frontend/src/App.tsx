import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./app.css";
import Home from "./pages/Home";
import Quote from "./pages/Quote";
import ExpertConsultation from "./pages/ExpertConsultation";
import Guide from "./pages/Guide";
import Community from "./pages/Community";
import MyPage from "./pages/MyPage";
import SignIn from "./pages/SignIn";
import Setting from "./pages/Setting";
import SecondSetting from "./pages/SecondSetting";
import RedirectPage from "./pages/RedirectPage";
import Admin from "./pages/Admin";
import ExpertVerifyLayout from "./components/layout/ExpertVerifyLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminProtectedRoute } from "./routes/AdminProtectedRoute";
import { WithGlossary } from "./routes/WithGlossary";
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
        {/* Public Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/oauth/kakao/redirect" element={<RedirectPage />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/second-setting" element={<SecondSetting />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/expert-verify" element={<ExpertVerifyLayout />} />

          {/* Glossary가 표시되는 페이지들 */}
          <Route element={<WithGlossary />}>
            <Route path="/quote" element={<Quote />} />
            <Route
              path="/expert-consultation"
              element={<ExpertConsultation />}
            />
            <Route path="/guide" element={<Guide />} />
            <Route path="/community" element={<Community />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
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
