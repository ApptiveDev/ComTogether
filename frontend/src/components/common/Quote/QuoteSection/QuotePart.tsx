import { useState, useRef } from "react";
import QuoteHeader from "./QuoteHeader/QuoteHeader";
import QuoteButton from "./QuoteButton/QuoteButton";
import SelectedPartList from "./SelectedPartList/SelectedPartList";
import CompatibilityCheckModal from "../../CompatibilityCheckModal/CompatibilityCheckModal";
import styles from "./quotePart.module.css";
import { useQuoteCartContext } from "@/contexts/QuoteCartContext";
// import { compatibilityCheckService } from "@/api/services/compatibilityCheckService";
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
      .filter(([part]) => part !== null)
      .map(([category, part]) => ({
        title: part!.name,
        category3: category,
      }));
  };

  // 호환성 체크 핸들러 (임시: API 비활성화, UI만 표시)
  const handleCompatibilityCheck = () => {
    const parts = convertToApiFormat();

    if (parts.length === 0) {
      alert("부품을 선택해주세요.");
      return;
    }

    console.log("🔍 호환성 체크 요청 (임시 - API 비활성화):", parts);

    // 기존 결과 초기화 및 모달 열기
    setCheckResults([]);
    setIsModalOpen(true);
    setIsChecking(true);

    // 임시: 더미 데이터로 UI 테스트 (10개 항목)
    const dummyResults: CompatibilityCheckDetail[] = [
      {
        check_id: 1,
        check_name: "CPU ↔ 메인보드 호환성",
        status: "SUCCESS",
        result: "POSITIVE",
        details: "CPU와 메인보드가 호환됩니다.",
        warnings: [],
        errors: [],
      },
      {
        check_id: 2,
        check_name: "메모리 타입 호환성",
        status: "SUCCESS",
        result: "POSITIVE",
        details: "메모리 타입이 호환됩니다.",
        warnings: [],
        errors: [],
      },
      {
        check_id: 3,
        check_name: "메모리 속도 호환성",
        status: "SUCCESS",
        result: "POSITIVE",
        details: "메모리 속도가 호환됩니다.",
        warnings: [],
        errors: [],
      },
      {
        check_id: 4,
        check_name: " 메인보드 ↔ 케이스 폼펙 호환성",
        status: "SUCCESS",
        result: "NEGATIVE",
        details: "메인보드와 케이스 폼팩이 호환되지 않습니다.",
        warnings: [],
        errors: ["폼팩을 확인해주세요."],
      },
      {
        check_id: 5,
        check_name: "GPU ↔ 케이스 호환성",
        status: "SUCCESS",
        result: "NEGATIVE",
        details: "GPU가 케이스에 장착할 수 없습니다.",
        warnings: [],
        errors: ["케이스 크기를 확인해주세요."],
      },
      {
        check_id: 6,
        check_name: "전력 안정성",
        status: "SUCCESS",
        result: "NEGATIVE",
        details: "전력이 부족합니다.",
        warnings: [],
        errors: ["파워 용량을 확인해주세요."],
      },
      {
        check_id: 7,
        check_name: "파워 커넥터 호환성 검사",
        status: "SUCCESS",
        result: "POSITIVE",
        details: "파워 커넥터가 호환됩니다.",
        warnings: [],
        errors: [],
      },
      {
        check_id: 8,
        check_name: "스토리지",
        status: "SUCCESS",
        result: "POSITIVE",
        details: "스토리지가 호환됩니다.",
        warnings: [],
        errors: [],
      },
      {
        check_id: 9,
        check_name: "CPU 쿨러 ↔ 케이스/램 (높이 및 간섭)",
        status: "SUCCESS",
        result: "POSITIVE",
        details: "CPU 쿨러가 호환됩니다.",
        warnings: [],
        errors: [],
      },
      {
        check_id: 10,
        check_name: " OS/드라이버",
        status: "SUCCESS",
        result: "POSITIVE",
        details: "OS/드라이버가 호환됩니다.",
        warnings: [],
        errors: [],
      },
    ];

    // 랜덤한 순서로 결과 추가 (더 나은 UX)
    const shuffledIndices = [3, 7, 1, 9, 2, 5, 8, 4, 10, 6]; // 섞인 순서
    shuffledIndices.forEach((checkId, index) => {
      setTimeout(() => {
        const result = dummyResults.find((r) => r.check_id === checkId);
        if (result) {
          setCheckResults((prev) => [...prev, result]);
        }
        if (index === shuffledIndices.length - 1) {
          setIsChecking(false);
          console.log("✅ 모든 호환성 체크 완료 (임시 - 더미 데이터)");
        }
      }, (index + 1) * 500);
    });

    // 실제 API 호출 (주석 처리)
    /*
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
    */
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
