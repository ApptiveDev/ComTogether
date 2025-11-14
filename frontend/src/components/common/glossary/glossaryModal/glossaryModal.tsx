import { useRef } from "react";
import styles from "./glossaryModal.module.css";
import close_icon from "@/assets/image/icon/close_icon.svg";

import SearchBar from "../../searchBar/searchBar";
import SearchResult from "../searchResult/searchResult";
import NoSearchResult from "../noSearchResult/noSearchResult";
import { useSearchGlossaryStore } from "../../../../stores/useSearchGlossaryStore";
import { useShallow } from "zustand/shallow";

interface GlossaryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GlossaryModal({ open, onClose }: GlossaryModalProps) {
  const modalBackground = useRef<HTMLDivElement>(null);
  const { selectedGlossaryId, setShowMore, hasSearched } =
    useSearchGlossaryStore(
      useShallow((state) => ({
        selectedGlossaryId: state.selectedGlossaryId,
        setShowMore: state.setShowMore,
        hasSearched: state.hasSearched,
      }))
    );

  if (!open) return null;

  const handleClose = () => {
    setShowMore(false);
    onClose();
  };

  return (
    <div
      className={styles.modalContainer}
      ref={modalBackground}
      onClick={(e) => {
        if (e.target === modalBackground.current) {
          handleClose();
        }
      }}
    >
      <div className={styles.modalContent}>
        <button className={styles.modalCloseBtn} onClick={handleClose}>
          <img src={close_icon} alt="Close" />
        </button>
        <SearchBar />
        <div className={styles.searchResultScroll}>
          {selectedGlossaryId ? (
            <SearchResult />
          ) : hasSearched ? (
            <NoSearchResult message="검색 결과가 없습니다." />
          ) : (
            <NoSearchResult />
          )}
        </div>
      </div>
    </div>
  );
}
