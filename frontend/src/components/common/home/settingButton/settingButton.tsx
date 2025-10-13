import style from "./settingButton.module.css";
import profileImg from "@/assets/image/profile_temp.png";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../../stores/useAuthStore";

export default function SettingButton() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // 디버깅을 위한 로그 추가
  console.log("🔍 SettingButton - user:", user);
  console.log("🔍 SettingButton - profile_image_url:", user?.profile_image_url);

  // user가 null인 경우 처리
  if (!user) {
    return null;
  }

  return (
    <button className={style.settingBtn} onClick={() => navigate("/mypage")}>
      <img
        src={
          user.profile_image_url && user.profile_image_url.trim() !== ""
            ? user.profile_image_url
            : profileImg
        }
        alt="profile"
      />
      <span>안녕하세요, {user.name}님.</span>
    </button>
  );
}
