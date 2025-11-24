import QuoteHeader from "./QuoteHeader/QuoteHeader";
import QuoteButton from "./QuoteButton/QuoteButton";
import SelectedPartList from "./SelectedPartList/SelectedPartList";
import styles from "./quotePart.module.css";

export default function QuotePart() {
  return (
    <div className={styles.container}>
      <QuoteHeader />
      <SelectedPartList />
      <div className={styles.btnContainer}>
        <QuoteButton content="호환성 체크" variant="primary" size="lg" />
        <QuoteButton content="저장" variant="outline" size="lg" />
      </div>
    </div>
  );
}
