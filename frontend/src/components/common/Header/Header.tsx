import style from "./header.module.css";
import NavButton from "../home/NavButton/NavButton";
import SettingButton from "../home/SettingButton/SettingButton";
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
          text="견적 짜기"
          onClick={() => {
            navigate("/quote");
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
