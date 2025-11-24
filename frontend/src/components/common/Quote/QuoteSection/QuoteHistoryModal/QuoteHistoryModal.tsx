import { useState } from "react";
import Modal from "@/components/ui/Modal/Modal";
import check from "@/assets/image/quoteCheck.svg";
import styles from "./quoteHistoryModal.module.css";
import QuoteButton from "../QuoteButton/QuoteButton";

interface HistoryItem {
  id: number;
  title: string;
  date: string;
}

interface QuoteHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  histories: HistoryItem[];
  onSelect: (id: number) => void;
  container: React.RefObject<HTMLDivElement | null>;
}

export default function EstimateHistoryModal({
  isOpen,
  onClose,
  histories,
  onSelect,
  container,
}: EstimateHistoryModalProps) {
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
          {histories.map((item) => (
            <div
              key={item.id}
              className={`${styles.row} ${
                selectedId === item.id ? styles.selected : ""
              }`}
            >
              <div
                className={`${styles.checkIcon} ${
                  selectedId === item.id ? styles.selected : ""
                }`}
                onClick={() => handleSelect(item.id)}
              >
                <img src={check} alt="check" />
              </div>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.date}>{item.date}</div>
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
