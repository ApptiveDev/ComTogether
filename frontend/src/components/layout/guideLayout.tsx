import style from "./guideLayout.module.css";
import Header from "../common/header/Header";
import Sidebar from "../common/guide/sidebar/Sidebar";
import StepIndicator from "../common/guide/stepIndicator/StepIndicator";
import ContentArea from "../common/guide/contentArea/ContentArea";

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
