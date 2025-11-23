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

export default function SecondSettingLayout() {
  const [count, setCount] = useState(0);
  const initializeMutation = useInitializeUser();
  const { tempRole, tempInterestIds, setCurrentStep } = useProfileSetupStore();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    // 페이지 진입 시 현재 단계 저장
    setCurrentStep("interest-selection");
  }, [setCurrentStep]);

  const handleNext = () => {
    if (count > 0 && tempRole) {
      console.log("🎯 사용자 초기화 시작");
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
        <div className={style.leftSection}>
          <div className={style.logoutBtnWrapper}>
            <Button
              color="white"
              backgroundColor="#f5f5f5"
              content="로그아웃"
              onClick={handleLogout}
              size="md"
            />
          </div>
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
