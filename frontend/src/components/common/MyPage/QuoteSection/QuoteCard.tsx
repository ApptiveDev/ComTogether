import styles from "./QuoteCard.module.css";
import type { Quote } from "./mock";
import checkIcon from "@/assets/image/green_check.svg";
import alertIcon from "@/assets/image/alert.svg";

type Props = {
  quote: Quote;
};

export default function QuoteCard({ quote }: Props) {
  const isDone = quote.compatibilityStatus === "DONE";

  return (
    <div
      className={`${styles.card} ${
        isDone ? styles.done : styles.pending
      }`}
    >
      <div className={styles.info}>
        <div className={styles.titleRow}>
          {/*미완료일 때만 '임시저장' */}
          {!isDone && (
            <span className={styles.temp}>임시저장</span>
          )}
          <span className={styles.title}>{quote.title}</span>
        </div>

        <div className={styles.dateRow}>
          <span className={styles.date}>{quote.date}</span>

          {/*완료일 때만 날짜 옆 텍스트 */}
          {isDone && (
            <span className={styles.doneText}>
              호환성 검사 완료
            </span>
          )}
        </div>
      </div>

      <div
        className={
          isDone ? styles.badgeDone : styles.badgePending
        }
      >
        <img
          src={isDone ? checkIcon : alertIcon}
          alt=""
          aria-hidden
          className={styles.badgeIcon}
        />
        <span>{isDone ? "호환성 검사 완료" : "호환성 검사 미완료"}</span>
      </div>
    </div>
  );
}
