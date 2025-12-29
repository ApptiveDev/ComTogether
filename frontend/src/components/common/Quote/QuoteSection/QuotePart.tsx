import { useState, useRef } from "react";
import QuoteHeader from "./QuoteHeader/QuoteHeader";
import QuoteButton from "./QuoteButton/QuoteButton";
import SelectedPartList from "./SelectedPartList/SelectedPartList";
import CompatibilityCheckModal from "../../CompatibilityCheckModal/CompatibilityCheckModal";
import styles from "./quotePart.module.css";
import { useQuoteCartContext } from "@/contexts/QuoteCartContext";
import { compatibilityCheckService } from "@/api/services/compatibilityCheckService";
import type {
  CompatibilityCheckItem,
  CompatibilityCheckDetail,
} from "@/types/compatibility";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkResults, setCheckResults] = useState<CompatibilityCheckDetail[]>(
    []
  );
  const [isChecking, setIsChecking] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // selectedParts를 API 형식으로 변환하는 함수
  const convertToApiFormat = (): CompatibilityCheckItem[] => {
    return Object.entries(selectedParts)
      .filter(([, part]) => part)
      .map(([category, part]) => ({
        title: part!.name,
        category3: category,
      }));
  };

  // 호환성 체크 핸들러 (SSE 기반)
  const handleCompatibilityCheck = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const parts = convertToApiFormat();

    if (parts.length === 0) {
      alert("부품을 선택해주세요.");
      return;
    }

    setCheckResults([]);
    setIsModalOpen(true);
    setIsChecking(true);

    eventSourceRef.current = compatibilityCheckService.checkCompatibilityStream(
      { items: parts },
      (result) => {
        setCheckResults((prev) => {
          const next = [...prev];
          const index = next.findIndex(
            (item) => item.check_id === result.check_id
          );
          if (index >= 0) {
            next[index] = result;
            return next;
          }
          return [...next, result];
        });
      },
      () => {
        setIsChecking(false);
        console.log("✅ 모든 호환성 체크 완료");
      },
      (error) => {
        setIsChecking(false);
        console.error("❌ 호환성 체크 에러:", error);
        alert("호환성 체크 중 오류가 발생했습니다.");
        setIsModalOpen(false);
      }
    );
  };

  // 모달 닫을 때 SSE 연결 종료
  const handleCloseModal = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsModalOpen(false);
    setIsChecking(false);
    setCheckResults([]);
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
          content={isChecking ? "체크 중..." : "호환성 체크"}
          variant="primary"
          size="lg"
          onClick={handleCompatibilityCheck}
          disabled={isChecking}
        />
        <QuoteButton
          content="저장"
          variant="outline"
          size="lg"
          onClick={() => saveQuote(quoteName)}
        />
      </div>

      {/* 호환성 체크 모달 */}
      <CompatibilityCheckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        results={checkResults}
        isChecking={isChecking}
      />
    </div>
  );
}
