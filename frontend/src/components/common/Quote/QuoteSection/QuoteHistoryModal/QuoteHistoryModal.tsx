import { useState } from "react";
import Modal from "@/components/ui/Modal/Modal";
import check from "@/assets/image/quoteCheck.svg";
import styles from "./quoteHistoryModal.module.css";
import QuoteButton from "../QuoteButton/QuoteButton";
import type { QuoteListResponse } from "@/types/quote";

interface QuoteHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  histories: QuoteListResponse[];
  onSelect: (id: number) => void;
  container?: HTMLElement;
}

export default function EstimateHistoryModal({
  isOpen,
  onClose,
  histories,
  onSelect,
  container,
}: QuoteHistoryModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (selectedId !== null) {
      onSelect(selectedId);
      setSelectedId(null);
      onClose();
    }
  };

  // 날짜 포맷팅 함수 (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    return dateString.split("T")[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      positionType="target"
      container={container}
    >
      <div className={styles.table}>
        <div className={styles.headerRow}>
          <div></div>
          <div>견적명</div>
          <div>작성일</div>
        </div>

        <div className={styles.list}>
          {histories.map((item: QuoteListResponse) => (
            <div
              key={item.quote_id}
              className={`${styles.row} ${
                selectedId === item.quote_id ? styles.selected : ""
              }`}
            >
              <div
                className={`${styles.checkIcon} ${
                  selectedId === item.quote_id ? styles.selected : ""
                }`}
                onClick={() => handleSelect(item.quote_id)}
              >
                <img src={check} alt="check" />
              </div>
              <div className={styles.title}>{item.name}</div>
              <div className={styles.date}>{formatDate(item.created_at)}</div>
            </div>
          ))}
        </div>
        <div className={styles.btnContainer}>
          <QuoteButton
            content="확인"
            variant="outline"
            size="sm"
            onClick={handleConfirm}
          />
        </div>
      </div>
    </Modal>
  );
}
