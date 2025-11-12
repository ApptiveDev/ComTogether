import style from "./secondSettingLayout.module.css";
import StepHeader from "../common/setting/stepHeader/stepHeader";
import stepImg from "@/assets/image/second-step-status.svg";
import InterestSelector from "../common/setting/interestSelector/interestSelector";
import NextButton from "../common/setting/nextButton/nextButton";
import { useState } from "react";
import { useInitializeUser } from "../../api/services/useInitializeUser";
import { useProfileSetupStore } from "../../stores/useProfileSetupStore";

export default function SecondSettingLayout() {
  const [count, setCount] = useState(0);
  const initializeMutation = useInitializeUser();
  const { tempRole, tempInterestIds } = useProfileSetupStore();

  const handleNext = () => {
    if (count > 0 && tempRole) {
      console.log("🎯 사용자 초기화 시작");
      initializeMutation.mutate({
        role: tempRole,
        interest_ids: tempInterestIds,
      });
    }
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
        <div className={style.interestCount}>선택된 관심사: {count}개</div>
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
