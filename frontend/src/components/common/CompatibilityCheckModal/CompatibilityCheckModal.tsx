import { useMemo, useEffect, useState } from "react";
import Modal from "../../ui/Modal/Modal";
import complete from "../../../assets/image/icon/complete.svg";
import notComplete from "../../../assets/image/icon/not_complete.svg";
import styles from "./compatibilityCheckModal.module.css";
import type {
  CompatibilityCheckDetail,
  CompatibilityCheckItem,
} from "@/types/compatibility";
import { compatibilityCheckService } from "@/api/services/compatibilityCheckService";

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CompatibilityCheckDetail[];
  isChecking: boolean;
  items: CompatibilityCheckItem[];
}

type CheckStatus = "pending" | "complete" | "warning" | "error";

interface CheckItem {
  id: number;
  label: string;
  status: CheckStatus;
  details?: string;
  warnings: string[];
  errors: string[];
}

const CHECK_ITEMS_CONFIG = [
  { id: 1, label: "CPU ↔ 메인보드 호환성" },
  { id: 2, label: "메모리 타입 호환성" },
  { id: 3, label: "메모리 속도 호환성" },
  { id: 4, label: "메인보드 ↔ 케이스 폼팩 호환성" },
  { id: 5, label: "GPU ↔ 케이스 호환성" },
  { id: 6, label: "전력 안정성" },
  { id: 7, label: "파워 커넥터 호환성" },
  { id: 8, label: "스토리지 호환성" },
  { id: 9, label: "CPU 쿨러 ↔ 케이스/램 호환성" },
  { id: 10, label: "OS/드라이버 호환성" },
] as const;

const CHECK_LABEL_MAP = new Map<number, string>(
  CHECK_ITEMS_CONFIG.map((config) => [config.id, config.label])
);

const CHECK_SLOT_COUNT = CHECK_ITEMS_CONFIG.length;

const createInitialItems = (): CheckItem[] =>
  CHECK_ITEMS_CONFIG.map((config) => ({
    id: config.id,
    label: config.label,
    status: "pending",
    warnings: [],
    errors: [],
  }));

export default function CompatibilityCheckModal({
  isOpen,
  onClose,
  results,
  isChecking,
  items,
}: CompatibilityCheckModalProps) {
  const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCheckItems(createInitialItems());
    } else {
      setCheckItems([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!results || results.length === 0) {
      return;
    }

    setCheckItems((prevItems) => {
      const map = new Map(prevItems.map((item) => [item.id, item]));

      results.forEach((result) => {
        const status: CheckStatus =
          result.result === "NEGATIVE" || result.status === "ERROR"
            ? "error"
            : result.result === "WARNING" || result.result === "UNKNOWN"
            ? "warning"
            : "complete";

        map.set(result.check_id, {
          id: result.check_id,
          label:
            result.check_name ||
            CHECK_LABEL_MAP.get(result.check_id) ||
            `검사 ${result.check_id}`,
          status,
          details: result.details,
          warnings: result.warnings ?? [],
          errors: result.errors ?? [],
        });
      });

      for (let i = 1; i <= CHECK_SLOT_COUNT; i += 1) {
        if (!map.has(i)) {
          map.set(i, {
            id: i,
            label: CHECK_LABEL_MAP.get(i) || `검사 ${i}`,
            status: "pending",
            warnings: [],
            errors: [],
          });
        }
      }

      return Array.from(map.values()).sort((a, b) => a.id - b.id);
    });
  }, [results]);

  const hasErrors = useMemo(
    () => checkItems.some((item) => item.status === "error"),
    [checkItems]
  );

  const hasWarnings = useMemo(
    () => checkItems.some((item) => item.status === "warning"),
    [checkItems]
  );

  const completedItems = useMemo(
    () => checkItems.filter((item) => item.status !== "pending"),
    [checkItems]
  );

  const pendingCount = useMemo(
    () => checkItems.filter((item) => item.status === "pending").length,
    [checkItems]
  );

  const renderCheckStatus = (item: CheckItem) => {
    if (item.status === "pending") {
      return (
        <div className={styles.checkItem}>
          <div className={styles.pendingCircle}>
            <span className={styles.pendingSpinner} />
          </div>
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
        <div className={styles.checkItem}>
          <div className={styles.warningCircle}>!</div>
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
    return null;
  };

  const sortedItems = useMemo(
    () => [...checkItems].sort((a, b) => a.id - b.id),
    [checkItems]
  );

  const allComplete =
    !isChecking && sortedItems.length > 0 && !hasErrors && pendingCount === 0;

  // PDF 다운로드 핸들러
  const handlePdfDownload = async () => {
    if (!allComplete || isPdfLoading) return;

    setIsPdfLoading(true);
    try {
      const pdfBlob = await compatibilityCheckService.downloadPdf({
        title: "호환성 체크 결과",
        results: results,
        items: items,
      });

      // Blob을 다운로드
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `호환성체크_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 다운로드 실패:", error);
      alert("PDF 다운로드에 실패했습니다.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="호환성 체크" size="xl">
      <div className={styles.container}>
        <div className={styles.grid}>
          {sortedItems.map((item) => (
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
          {!hasErrors && hasWarnings && (
            <p className={styles.warningMessage}>
              일부 항목에서 주의가 필요합니다. 세부 내용을 확인해주세요.
            </p>
          )}
          {!hasErrors &&
            !hasWarnings &&
            !isChecking &&
            sortedItems.length > 0 &&
            pendingCount === 0 && (
              <p className={styles.completeMessage}>
                모든 호환성 검사를 통과했습니다.
              </p>
            )}
          {!hasErrors && !hasWarnings && (isChecking || pendingCount > 0) && (
            <p>
              검사를 진행 중입니다... ({completedItems.length}/
              {sortedItems.length})
            </p>
          )}
        </div>

        {completedItems.length > 0 && (
          <div className={styles.details}>
            {sortedItems
              .filter((item) => item.status !== "pending")
              .map((item) => (
                <div key={item.id} className={styles.detailItem}>
                  <h4>{item.label}</h4>
                  {item.errors.length > 0 && (
                    <ul className={styles.errorList}>
                      {item.errors.map((error, index) => (
                        <li
                          key={`error-${item.id}-${index}`}
                          className={styles.errorText}
                        >
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.warnings.length > 0 && (
                    <ul className={styles.warningList}>
                      {item.warnings.map((warning, index) => (
                        <li
                          key={`warning-${item.id}-${index}`}
                          className={styles.warningText}
                        >
                          {warning}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.details && (
                    <p className={styles.detailText}>{item.details}</p>
                  )}
                </div>
              ))}
          </div>
        )}

        <button
          className={styles.pdfButton}
          disabled={!allComplete || isPdfLoading}
          onClick={handlePdfDownload}
        >
          {isPdfLoading ? "PDF 생성 중..." : "PDF 내보내기"}
        </button>
      </div>
    </Modal>
  );
}
