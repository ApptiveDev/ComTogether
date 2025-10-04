import style from "./header.module.css";
import NavButton from "../home/navButton/navButton";
import SettingButton from "../home/settingButton/settingButton";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [showHeader, setShowHeader] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setShowHeader(true);
  }, []);

  return (
    <div className={`${style.header} ${showHeader ? style.show : ""}`}>
      <button className={style.logo} onClick={() => navigate("/")}>
        COM
        <br />
        TOGETHER
      </button>
      <div className={style.btnContainer}>
        <NavButton
          text="가이드 화면"
          onClick={() => {
            navigate("/guide");
          }}
        />
        <NavButton
          text="호환성 체크"
          onClick={() => {
            navigate("/compatibility-check");
          }}
        />
        <NavButton
          text="전문가 상담"
          onClick={() => {
            navigate("/expert-consultation");
          }}
        />
        <NavButton
          text="커뮤니티"
          onClick={() => {
            navigate("/community");
          }}
        />
      </div>
      <SettingButton />
    </div>
  );
}
