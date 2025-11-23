import style from "./stepHeader.module.css";

interface headerProp {
  step: string;
  image: string;
  question: string;
}

export default function StepHeader({ step, image, question }: headerProp) {
  return (
    <div className={style.container}>
      <div className={style.step}>{step}</div>
      <img src={image} alt="step" />
      <div className={style.question}>{question}</div>
    </div>
  );
}
