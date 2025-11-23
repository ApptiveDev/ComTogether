import style from "./settingButton.module.css";
import profileImg from "@/assets/image/profile_temp.png";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../../stores/useAuthStore";

export default function SettingButton() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

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
