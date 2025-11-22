import StepIndicatorItem from "./StepIndicatorItem";
import style from "./stepIndicator.module.css";
import { useGuidePart } from "../../../../stores/useGuidePart";
import { useGuideData } from "../../../../api/Guide";
import type { GuideData } from "../../../../types/guide";

// API 카테고리 이름 (소문자) -> 한글 표시명 매핑
const categoryNameMap: Record<string, string> = {
  cpu: "CPU",
  mainboard: "메인보드",
  ram: "RAM",
  gpu: "그래픽 카드",
  storage: "저장 장치",
  power: "파워 서플라이",
  case: "케이스",
  cooler: "쿨러/팬",
  etc: "기타 입출력 장치",
};

export default function StepIndicator() {
  const {
    currentStep,
    setCurrentStep,
    setSelectCategory,
    setContentPart,
    setShowMore,
  } = useGuidePart();

  // useGuideData 훅으로 데이터 가져오기
  const { data: allGuides, isLoading } = useGuideData();

  const isActive = (stepId: number) => currentStep === stepId;

  // 로딩 중일 때
  if (isLoading) {
    return <div className={style.container}>로딩 중...</div>;
  }

  // 데이터가 없을 때
  if (!allGuides) {
    return <div className={style.container}>데이터가 없습니다.</div>;
  }

  const guides = allGuides as GuideData[];

  return (
    <div className={style.container}>
      {guides.map((step) => {
        // API 카테고리명을 한글 표시명으로 변환
        const displayName =
          categoryNameMap[step.category.toLowerCase()] || step.category;

        return (
          <div className={style.content} key={step.id}>
            <div className={style.indicator}>
              <StepIndicatorItem
                isActive={isActive(step.id)}
                onClick={() => {
                  setCurrentStep(step.id);
                  setSelectCategory(step.category);
                  setContentPart("개요");
                  setShowMore(false);
                }}
              />
              <div
                className={`${style.label} ${
                  isActive(step.id) ? style.active : ""
                }`}
              >
                {displayName}
              </div>
            </div>
            {step.id < guides.length && <div className={style.separator} />}
          </div>
        );
      })}
    </div>
  );
}
