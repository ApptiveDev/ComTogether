import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/home";
import CompatibilityCheck from "./pages/compatibilityCheck";
import ExpertConsultation from "./pages/expertConsultation";
import Guide from "./pages/guide";
import Community from "./pages/community";
import MyPage from "./pages/myPage";
import SignIn from "./pages/signIn";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/compatibility-check"} element={<CompatibilityCheck />} />
        <Route path={"/expert-consultation"} element={<ExpertConsultation />} />
        <Route path={"/guide"} element={<Guide />} />
        <Route path={"/community"} element={<Community />} />
        <Route path={"/mypage"} element={<MyPage />} />
        <Route path={"/sign-up"} element={<SignIn />} />
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
