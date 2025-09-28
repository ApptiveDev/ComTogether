import { BrowserRouter, Route, Routes, Navigate } from "react-router";
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
import { ProtectedRoute } from "./components/common/ProtectedRoute";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Navigate to="/sign-up" replace />} />
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
        <Route path={"/sign-up"} element={<SignIn />} />
        <Route
          path={"/expert-verify"}
          element={
            <ProtectedRoute>
              <ExpertVerifyLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/second-setting"
          element={
            <ProtectedRoute>
              <SecondSetting />
            </ProtectedRoute>
          }
        />
        <Route path={"/oauth/kakao/redirect"} element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <>
      <Router />
    </>
  );
}

export default App;
