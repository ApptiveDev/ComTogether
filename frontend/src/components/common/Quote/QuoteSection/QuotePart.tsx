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
      .filter(([_, part]) => part !== null)
      .map(([category, part]) => ({
        title: part!.name,
        category3: category,
      }));
  };

  // 호환성 체크 핸들러
  const handleCompatibilityCheck = () => {
    const parts = convertToApiFormat();

    if (parts.length === 0) {
      alert("부품을 선택해주세요.");
      return;
    }

    console.log("🔍 호환성 체크 요청:", parts);

    // 기존 결과 초기화 및 모달 열기
    setCheckResults([]);
    setIsModalOpen(true);
    setIsChecking(true);

    // SSE 연결
    eventSourceRef.current = compatibilityCheckService.checkCompatibilityStream(
      { items: parts },
      // onResult: 각 결과를 받을 때마다 호출
      (result) => {
        setCheckResults((prev) => [...prev, result]);
      },
      // onComplete: 모든 체크 완료
      () => {
        setIsChecking(false);
        console.log("✅ 모든 호환성 체크 완료");
      },
      // onError: 에러 발생
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
