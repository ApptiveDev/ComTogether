import styles from "./quoteHeader.module.css";
import QuoteButton from "../QuoteButton/QuoteButton";
import { useState, useRef } from "react";
import QuoteHistoryModal from "../QuoteHistoryModal/QuoteHistoryModal";
import { useSanitizedInput } from "@/hooks";
import type { QuoteListResponse } from "@/types/quote";

interface QuoteHeaderProps {
  totalPrice: number;
  quotes: QuoteListResponse[];
  quoteName: string;
  onQuoteNameChange: (name: string) => void;
  onSelectQuote: (id: number) => void;
}

export default function QuoteHeader({
  totalPrice,
  quotes,
  quoteName,
  onQuoteNameChange,
  onSelectQuote,
}: QuoteHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sanitize } = useSanitizedInput();

  const handleSelectEstimate = (id: number) => {
    onSelectQuote(id);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitize(e.target.value);
    onQuoteNameChange(sanitizedValue);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <div className={styles.totalPrice}>
          총: {totalPrice.toLocaleString()}원
        </div>
        <input
          type="text"
          className={styles.nameInput}
          placeholder="견적 이름 (최대 10자)"
          value={quoteName}
          maxLength={10}
          onChange={handleNameChange}
        />
        <div className={styles.btnContainer}>
          <QuoteButton
            content="이전 견적"
            variant="outline"
            size="md"
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
        </div>
      </div>
      <div className={styles.modalWrapper} ref={modalRef}>
        <QuoteHistoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          histories={quotes}
          onSelect={handleSelectEstimate}
          container={modalRef}
        />
      </div>
    </div>
  );
}
