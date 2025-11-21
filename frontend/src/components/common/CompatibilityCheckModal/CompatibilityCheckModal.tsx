import { useState, useEffect } from "react";
import Modal from "../../ui/Modal/Modal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import complete from "../../../assets/image/icon/complete.svg";
import styles from "./CompatibilityCheckModal.module.css";

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckItem {
  id: string;
  label: string;
  status: "pending" | "loading" | "complete";
}

const checkItems: CheckItem[] = [
  { id: "monitor", label: "물리 규격 호환성", status: "pending" },
  { id: "resolution", label: "전원 호환", status: "pending" },
  { id: "memory-type", label: "메모리 타입", status: "pending" },
  { id: "memory-speed", label: "메모리 속도", status: "pending" },
  { id: "graphics", label: "파워 용량", status: "pending" },
  { id: "graphics-power", label: "그래픽 카드 /파워 호환", status: "pending" },
  { id: "panel-type", label: "파워 포트 인증", status: "pending" },
  {
    id: "update-monitor",
    label: "수평 리프레쉬레이트 규격 지원",
    status: "pending",
  },
  { id: "vertical-refresh", label: "스토리지 형식 호환", status: "pending" },
  { id: "case-form", label: "케이스 폼팩터 포함성", status: "pending" },
  { id: "rgb", label: "RGB/ARGB 커넥터 호환성", status: "pending" },
  { id: "multimedia", label: "운영체제 및 드라이버 지원", status: "pending" },
];

export default function CompatibilityCheckModal({
  isOpen,
  onClose,
}: CompatibilityCheckModalProps) {
  const [items, setItems] = useState<CheckItem[]>(checkItems);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(-1);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isOpen && !isChecking) {
      // 모달이 열리면 자동으로 체크 시작
      startChecking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const startChecking = () => {
    setIsChecking(true);
    setCurrentCheckIndex(0);
    setItems(checkItems.map((item) => ({ ...item, status: "pending" })));
  };

  useEffect(() => {
    if (!isChecking || currentCheckIndex === -1) return;

    if (currentCheckIndex >= items.length) {
      setIsChecking(false);
      return;
    }

    // 현재 항목을 loading으로 변경
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === currentCheckIndex ? { ...item, status: "loading" } : item
      )
    );

    // 0.5초 후 complete로 변경하고 다음 항목으로
    const timer = setTimeout(() => {
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === currentCheckIndex ? { ...item, status: "complete" } : item
        )
      );
      setCurrentCheckIndex((prev) => prev + 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentCheckIndex, isChecking, items.length]);

  const renderCheckStatus = (item: CheckItem) => {
    if (item.status === "loading") {
      return (
        <div className={styles.checkItem}>
          <LoadingSpinner
            thickness={8}
            size="extraLarge"
            color="#FF5525"
            variant="spinner"
          />
        </div>
      );
    }
    if (item.status === "complete") {
      return (
        <div className={`${styles.checkItem} ${styles.complete}`}>
          <div className={styles.completeCircle}>
            <img src={complete} />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.checkItem}>
        <div className={styles.pendingCircle}></div>
      </div>
    );
  };

  const allComplete = items.every((item) => item.status === "complete");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="호환성 체크" size="xl">
      <div className={styles.container}>
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.gridItem}>
              <div className={styles.label}>{item.label}</div>{" "}
              {renderCheckStatus(item)}
            </div>
          ))}
        </div>

        <div className={styles.statusMessage}>
          {isChecking && !allComplete && <p>호환성 체크 중입니다...</p>}
          {allComplete && (
            <p className={styles.completeMessage}>
              ✔ 모든 호환성 체크가 완료되었습니다!
            </p>
          )}
        </div>

        <button
          className={styles.pdfButton}
          disabled={!allComplete}
          onClick={() => {
            // PDF 다운로드 로직
            console.log("PDF 다운로드");
          }}
        >
          PDF 내보내기
        </button>
      </div>
    </Modal>
  );
}
