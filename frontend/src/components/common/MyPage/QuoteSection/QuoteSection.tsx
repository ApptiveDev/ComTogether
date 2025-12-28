import styles from "./quoteSection.module.css";
import QuoteCard from "./QuoteCard";
import { quoteMock } from "./mock";

export default function QuoteSection() {
  const visibleQuotes = quoteMock.slice(0, 2);

  return (
    <div className={styles.section}>
      {visibleQuotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
}
