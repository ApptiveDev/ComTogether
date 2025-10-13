import StepIndicatorItem from "./stepIndicatorItem";
import style from "./stepIndicator.module.css";
import { useGuidePart } from "../../../../stores/useGuidePart";
import data from "../../../../dummy/dummy_guide.json";

export default function StepIndicator() {
  const { currentStep, setCurrentStep, setSelectCategory, setContentPart } =
    useGuidePart();
  const isActive = (stepId: number) => currentStep === stepId;

  return (
    <div className={style.container}>
      {data.map((step) => (
        <div className={style.content} key={step.id}>
          <div className={style.indicator}>
            <StepIndicatorItem
              isActive={isActive(step.id)}
              onClick={() => {
                setCurrentStep(step.id);
                setSelectCategory(step.category);
                setContentPart("개요");
              }}
            />
            <div
              className={`${style.label} ${
                isActive(step.id) ? style.active : ""
              }`}
            >
              {step.category}
            </div>
          </div>
          {step.id < data.length && <div className={style.separator} />}
        </div>
      ))}
    </div>
  );
}
