import style from "./secondSettingLayout.module.css";
import StepHeader from "../common/setting/StepHeader/StepHeader";
import stepImg from "@/assets/image/second-step-status.svg";
import InterestSelector from "../common/setting/interestSelector/InterestSelector";
import NextButton from "../common/setting/NextButton/NextButton";
import { useState, useEffect } from "react";
import { useInitializeUser } from "../../api/services/useInitializeUser";
import { useProfileSetupStore } from "../../stores/useProfileSetupStore";
import { useLogout } from "@/api/services/useLogout";
import Button from "../common/Button/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

export default function SecondSettingLayout() {
  const [count, setCount] = useState(0);
  const initializeMutation = useInitializeUser();
  const { tempRole, tempInterestIds, setCurrentStep } = useProfileSetupStore();
  const { mutate: logout } = useLogout();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // tempRole이 없으면 Setting 페이지로 리다이렉트
    if (!tempRole) {
      navigate("/setting");
      return;
    }

    // 페이지 진입 시 현재 단계 저장
    setCurrentStep("interest-selection");
  }, [tempRole, setCurrentStep, navigate]);
  const handleNext = () => {
    if (count > 0 && tempRole) {
      initializeMutation.mutate({
        role: tempRole,
        interest_ids: tempInterestIds,
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={style.container}>
      <div className={style.stepContent}>
        <StepHeader
          step="STEP 02"
          image={stepImg}
          question="관심사가 무엇인가요?"
        />
        <InterestSelector count={count} setCount={setCount} />
      </div>
      <div className={style.interestFooter}>
<<<<<<< HEAD
        <div className={style.leftSection}>
=======
        <div className={style.userInfo}>
>>>>>>> yuhoyeong/frontend/setting-page-renual
          <div className={style.logoutBtnWrapper}>
            <Button
              color="white"
              backgroundColor="#f5f5f5"
              content="로그아웃"
              onClick={handleLogout}
              size="md"
            />
          </div>
<<<<<<< HEAD
=======
          {user?.email && <span className={style.userEmail}>{user.email}</span>}
>>>>>>> yuhoyeong/frontend/setting-page-renual
          <div className={style.interestCount}>선택된 관심사: {count}개</div>
        </div>
        <NextButton
          btnAbled={count > 0 && !initializeMutation.isPending}
          onClick={handleNext}
          text={initializeMutation.isPending ? "처리 중..." : "완료"}
        />
        {initializeMutation.isError && (
          <div className={style.errorMessage}>
            {initializeMutation.error?.message ||
              "초기화에 실패했습니다. 다시 시도해주세요."}
          </div>
        )}
      </div>
    </div>
  );
}
