import React from "react";
import style from "./settingButton.module.css";
import profileImg from "@/assets/image/profile_temp.png";
import { useNavigate } from "react-router";

const name: string = "홍길동";
export default function SettingButton() {
  const navigate = useNavigate();
  return (
    <button className={style.settingBtn} onClick={() => navigate("/mypage")}>
      <img src={profileImg} alt="profile" />
      <span>안녕하세요, {name}님.</span>
    </button>
  );
}
