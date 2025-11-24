import style from "./settingLayout.module.css";
import StepHeader from "../common/setting/StepHeader/StepHeader";
import SkillLevelCard from "../common/setting/SkillLevelCard/SkillLevelCard";
import NextButton from "../common/setting/NextButton/NextButton";
import beginner from "@/assets/image/beginner.svg";
import expert from "@/assets/image/expert.svg";
import stepImg from "@/assets/image/step-status.svg";
import ExpertPopup from "../common/setting/ExpertPopup/ExpertPopup";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useProfileSetupStore } from "../../stores/useProfileSetupStore";
import { useLogout } from "@/api/services/useLogout";
import Button from "../common/Button/Button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SettingLayout() {
  const [abled, setAbled] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<
    "BEGINNER" | "EXPERT" | null
  >(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();
  const { setTempRole, setCurrentStep } = useProfileSetupStore();
  const { mutate: logout } = useLogout();
  const { user } = useAuthStore();

  useEffect(() => {
    setCurrentStep("role-selection");
  }, [setCurrentStep]);

  useEffect(() => {
    setAbled(selectedLevel !== null);
  }, [selectedLevel]);

  const handleLevelSelect = (level: "BEGINNER" | "EXPERT" | null) => {
    setSelectedLevel(level);
  };

  const handleNext = async () => {
    if (!selectedLevel) return;
    setTempRole(selectedLevel);

    if (selectedLevel === "EXPERT") {
      setCurrentStep("expert-verify");
      setIsPopupOpen(true);
    } else if (selectedLevel === "BEGINNER") {
      setCurrentStep("interest-selection");
      navigate("/second-setting");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={style.container}>
      {isPopupOpen && (
        <ExpertPopup setIsPopupOpen={setIsPopupOpen} className="expert-popup" />
      )}
      {isPopupOpen && <div className={style.popupWrap}></div>}
      <div className={`${style.content} ${isPopupOpen ? style.open : ""}`}>
        <StepHeader
          step="STEP 01"
          image={stepImg}
          question="컴퓨터에 대한 숙련도가 어떻게 되시나요?"
        />
        <div className={style.cards}>
          <SkillLevelCard
            level="초보자"
            description={`컴퓨터 사용이 익숙하지 않고\n기본적이 도움이 필요해요.`}
            image={beginner}
            onClick={() => handleLevelSelect("BEGINNER")}
            check={selectedLevel === "BEGINNER"}
          />
          <SkillLevelCard
            level="전문가"
            description={`컴퓨터 사용이 익숙하고\n조립형 PC에 대한 전문지식이 충분해요.`}
            image={expert}
            onClick={() => handleLevelSelect("EXPERT")}
            check={selectedLevel === "EXPERT"}
          />
        </div>
        <div className={style.btnContainer}>
<<<<<<< HEAD
          <div className={style.logoutBtnWrapper}>
            <Button
              color="white"
              backgroundColor="#f5f5f5"
              content="로그아웃"
              onClick={handleLogout}
              size="md"
            />
=======
          <div className={style.userInfo}>
            <div className={style.logoutBtnWrapper}>
              <Button
                color="white"
                backgroundColor="#f5f5f5"
                content="로그아웃"
                onClick={handleLogout}
                size="md"
              />
            </div>
            {user?.email && (
              <span className={style.userEmail}>{user.email}</span>
            )}
>>>>>>> yuhoyeong/frontend/setting-page-renual
          </div>
          <NextButton btnAbled={abled} onClick={handleNext} text="다음" />
        </div>
      </div>
    </div>
  );
}
