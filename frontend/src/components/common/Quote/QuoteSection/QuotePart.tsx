import QuoteHeader from "./QuoteHeader/QuoteHeader";
import QuoteButton from "./QuoteButton/QuoteButton";
import SelectedPartList from "./SelectedPartList/SelectedPartList";
import styles from "./quotePart.module.css";
import { useQuoteCartContext } from "@/contexts/QuoteCartContext";

export default function QuotePart() {
  const {
    selectedParts,
    quotes,
    totalPrice,
    quoteName,
    setQuoteName,
    removeFromQuote,
    selectQuote,
    saveQuote,
  } = useQuoteCartContext();

  // 호환성 체크 핸들러
  const handleCompatibilityCheck = () => {
    console.log("호환성 체크:", selectedParts);
    // TODO: 호환성 체크 API 호출
  };

  return (
    <div className={styles.container}>
      <QuoteHeader
        totalPrice={totalPrice}
        quotes={quotes}
        quoteName={quoteName}
        onQuoteNameChange={setQuoteName}
        onSelectQuote={selectQuote}
      />
      <SelectedPartList
        selectedParts={selectedParts}
        onRemovePart={removeFromQuote}
      />
      <div className={styles.btnContainer}>
        <QuoteButton
          content="호환성 체크"
          variant="primary"
          size="lg"
          onClick={handleCompatibilityCheck}
        />
        <QuoteButton
          content="저장"
          variant="outline"
          size="lg"
          onClick={() => saveQuote(quoteName)}
        />
      </div>
    </div>
  );
}
