import styles from "./quoteSection.module.css";
import QuoteCard from "./QuoteCard";
import type { QuoteListResponse } from "@/types/quote";

type QuoteSectionProps = {
  quotes?: QuoteListResponse[];
  isLoading?: boolean;
  hasError?: boolean;
};

const VISIBLE_COUNT = 2;

export default function QuoteSection({
  quotes = [],
  isLoading,
  hasError,
}: QuoteSectionProps) {
  if (isLoading) {
    return (
      <div className={styles.section}>
        <p className={styles.state}>견적서를 불러오는 중이에요...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.section}>
        <p className={styles.state}>견적서를 불러오지 못했어요.</p>
      </div>
    );
  }

  if (!quotes.length) {
    return (
      <div className={styles.section}>
        <p className={styles.state}>작성된 견적서가 없습니다.</p>
      </div>
    );
  }

  const visibleQuotes = quotes.slice(0, VISIBLE_COUNT);

  return (
    <div className={styles.section}>
      {visibleQuotes.map((quote) => (
        <QuoteCard key={quote.quote_id} quote={quote} />
      ))}
    </div>
  );
}
