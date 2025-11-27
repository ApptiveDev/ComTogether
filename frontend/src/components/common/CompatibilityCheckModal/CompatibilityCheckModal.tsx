import { useState, useEffect } from "react";
import Modal from "../../ui/Modal/Modal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import complete from "../../../assets/image/icon/complete.svg";
import notComplete from "../../../assets/image/icon/not_complete.svg";
import styles from "./compatibilityCheckModal.module.css";
import type { CompatibilityCheckDetail } from "@/types/compatibility";

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CompatibilityCheckDetail[];
  isChecking: boolean;
}

interface CheckItem {
  id: number;
  label: string;
  status: "pending" | "loading" | "complete" | "error";
}

// 고정된 10개 검사 항목
const FIXED_CHECK_ITEMS: CheckItem[] = [
  { id: 1, label: "CPU ↔ 메인보드 호환성", status: "pending" },
  { id: 2, label: "메모리 타입 호환성", status: "pending" },
  { id: 3, label: "메모리 속도 호환성", status: "pending" },
  { id: 4, label: " 메인보드 ↔ 케이스 폼펙 호환성", status: "pending" },
  { id: 5, label: "GPU ↔ 케이스 호환성", status: "pending" },
  { id: 6, label: "전력 안정성", status: "pending" },
  { id: 7, label: "파워 커넥터 호환성 검사", status: "pending" },
  { id: 8, label: "스토리지", status: "pending" },
  { id: 9, label: "CPU 쿨러 ↔ 케이스/램 (높이 및 간섭)", status: "pending" },
  { id: 10, label: " OS/드라이버", status: "pending" },
];

export default function CompatibilityCheckModal({
  isOpen,
  onClose,
  results,
  isChecking,
}: CompatibilityCheckModalProps) {
  const [items, setItems] = useState<CheckItem[]>(FIXED_CHECK_ITEMS);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen && isChecking) {
      setItems(
        FIXED_CHECK_ITEMS.map((item) => ({ ...item, status: "loading" }))
      );
    }
  }, [isOpen, isChecking]);

  // SSE로 결과가 들어올 때마다 해당 항목만 업데이트
  useEffect(() => {
    if (results && results.length > 0) {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        results.forEach((result) => {
          const index = newItems.findIndex(
            (item) => item.id === result.check_id
          );
          if (index !== -1) {
            let status: CheckItem["status"] = "complete";
            if (result.result === "NEGATIVE") {
              status = "error";
            }
            newItems[index] = {
              ...newItems[index],
              status,
            };
          }
        });
        return newItems;
      });
    }
  }, [results]);

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
            <img src={complete} alt="완료" />
          </div>
        </div>
      );
    }
    if (item.status === "error") {
      return (
        <div className={`${styles.checkItem} ${styles.error}`}>
          <div className={styles.errorCircle}>
            <img src={notComplete} alt="에러" />
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

  const allComplete =
    !isChecking && items.every((item) => item.status !== "loading");
  const hasErrors = items.some((item) => item.status === "error");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="호환성 체크" size="xl">
      <div className={styles.container}>
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.gridItem}>
              <div className={styles.label}>{item.label}</div>
              {renderCheckStatus(item)}
            </div>
          ))}
        </div>

        <div className={styles.statusMessage}>
          {hasErrors && (
            <p className={styles.errorMessage}>
              ⚠ 호환성 체크가 미완료되었습니다.
            </p>
          )}
        </div>

        <button
          className={styles.pdfButton}
          disabled={!allComplete}
          onClick={() => {
            console.log("PDF 다운로드");
          }}
        >
          PDF 내보내기
        </button>
      </div>
    </Modal>
  );
}
