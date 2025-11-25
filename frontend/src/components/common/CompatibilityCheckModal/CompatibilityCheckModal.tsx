import { useState, useEffect } from "react";
import Modal from "../../ui/Modal/Modal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import complete from "../../../assets/image/icon/complete.svg";
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
  status: "pending" | "loading" | "complete" | "warning" | "error" | "unknown";
  result?: "POSITIVE" | "NEGATIVE" | "WARNING" | "UNKNOWN";
  details?: string;
  warnings?: string[];
  errors?: string[];
}

export default function CompatibilityCheckModal({
  isOpen,
  onClose,
  results,
  isChecking,
}: CompatibilityCheckModalProps) {
  const [items, setItems] = useState<CheckItem[]>([]);

  // 실시간으로 결과가 들어올 때마다 items 업데이트
  useEffect(() => {
    if (results && results.length > 0) {
      setItems(
        results.map((result) => {
          let status: CheckItem["status"] = "complete";

          if (result.status === "ERROR") {
            status = "unknown";
          } else if (result.result === "NEGATIVE") {
            status = "error";
          } else if (result.result === "WARNING") {
            status = "warning";
          } else if (result.result === "POSITIVE") {
            status = "complete";
          } else if (result.result === "UNKNOWN") {
            status = "unknown";
          }

          return {
            id: result.check_id,
            label: result.check_name,
            status,
            result: result.result,
            details: result.details,
            warnings: result.warnings,
            errors: result.errors,
          };
        })
      );
    } else if (!isChecking && results.length === 0) {
      // 체크가 끝났는데 결과가 없으면 초기화
      setItems([]);
    }
  }, [results, isChecking]);

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
    if (item.status === "warning") {
      return (
        <div className={`${styles.checkItem} ${styles.warning}`}>
          <div className={styles.warningCircle}>⚠</div>
        </div>
      );
    }
    if (item.status === "error") {
      return (
        <div className={`${styles.checkItem} ${styles.error}`}>
          <div className={styles.errorCircle}>✕</div>
        </div>
      );
    }
    if (item.status === "unknown") {
      return (
        <div className={`${styles.checkItem} ${styles.unknown}`}>
          <div className={styles.unknownCircle}>?</div>
        </div>
      );
    }
    return (
      <div className={styles.checkItem}>
        <div className={styles.pendingCircle}></div>
      </div>
    );
  };

  const allComplete = !isChecking && items.length > 0;
  const hasErrors = items.some((item) => item.status === "error");
  const hasWarnings = items.some((item) => item.status === "warning");

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
          {isChecking && <p>호환성 체크 중입니다... ({items.length}개 완료)</p>}
          {allComplete && !hasErrors && !hasWarnings && (
            <p className={styles.completeMessage}>
              ✔ 모든 호환성 체크가 완료되었습니다!
            </p>
          )}
          {allComplete && hasWarnings && !hasErrors && (
            <p className={styles.warningMessage}>
              ⚠ 일부 항목에 경고가 있습니다. 확인해주세요.
            </p>
          )}
          {allComplete && hasErrors && (
            <p className={styles.errorMessage}>
              ✕ 호환되지 않는 부품이 있습니다. 확인해주세요.
            </p>
          )}
        </div>

        {/* 세부 정보 표시 */}
        {items.length > 0 && (
          <div className={styles.details}>
            {items.map((item) =>
              (item.warnings && item.warnings.length > 0) ||
              (item.errors && item.errors.length > 0) ||
              item.details ? (
                <div key={item.id} className={styles.detailItem}>
                  <h4>
                    {item.status === "complete" && "✅ "}
                    {item.status === "warning" && "⚠️ "}
                    {item.status === "error" && "❌ "}
                    {item.status === "unknown" && "❓ "}
                    {item.label}
                  </h4>
                  {item.errors && item.errors.length > 0 && (
                    <ul className={styles.errorList}>
                      {item.errors.map((error, idx) => (
                        <li key={idx} className={styles.errorText}>
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.warnings && item.warnings.length > 0 && (
                    <ul className={styles.warningList}>
                      {item.warnings.map((warning, idx) => (
                        <li key={idx} className={styles.warningText}>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.details && (
                    <p className={styles.detailText}>{item.details}</p>
                  )}
                </div>
              ) : null
            )}
          </div>
        )}

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
