import style from "./guideLayout.module.css";
import Header from "../common/Header/Header";
import Sidebar from "../common/Guide/Sidebar/Sidebar";
import StepIndicator from "../common/Guide/StepIndicator/StepIndicator";
import ContentArea from "../common/Guide/ContentArea/ContentArea";

export default function GuideLayout() {
  return (
    <div className={style.container}>
      <Header />
      <StepIndicator />
      <div className={style.content}>
        <Sidebar />
        <ContentArea />
      </div>
    </div>
  );
}
