import styles from "./QuoteCard.module.css";
import type { QuoteListResponse } from "@/types/quote";
import checkIcon from "@/assets/image/green_check.svg";
import alertIcon from "@/assets/image/alert.svg";

type Props = {
  quote: QuoteListResponse;
};

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export default function QuoteCard({ quote }: Props) {
  const status =
    quote.compatibility_status ??
    (quote.compatibility_checked_at ? "DONE" : "PENDING");
  const isDone = status === "DONE";
  const dateLabel = formatDate(quote.updated_at ?? quote.created_at);

  return (
    <div className={`${styles.card} ${isDone ? styles.done : styles.pending}`}>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          {/*미완료일 때만 '임시저장' */}
          {!isDone && <span className={styles.temp}>임시저장</span>}
          <span className={styles.title}>{quote.name}</span>
        </div>

        <div className={styles.dateRow}>
          <span className={styles.date}>{dateLabel}</span>

          {/*완료일 때만 날짜 옆 텍스트 */}
          {isDone && <span className={styles.doneText}>호환성 검사 완료</span>}
        </div>
      </div>

      <div className={isDone ? styles.badgeDone : styles.badgePending}>
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
