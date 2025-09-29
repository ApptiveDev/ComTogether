import React, { useRef } from "react";
import styles from "./chatBotModal.module.css";
import close_icon from "@/assets/image/icon/close_icon.svg";

import SearchBar from "@/components/common/searchBar/searchBar";
import SearchResult from "@/components/common/chatBot/searchResult/searchResult";
import NoSearchResult from "@/components/common/chatBot/noSearchResult/noSearchResult";
import { useSearchChatBotStore } from "@/stores/useSearchChatBotStore";
import { useShallow } from "zustand/shallow";

interface ChatBotModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatBotModal({ open, onClose }: ChatBotModalProps) {
  const modalBackground = useRef<HTMLDivElement>(null);
  const { result, setShowMore, hasSearched } = useSearchChatBotStore(
    useShallow((state) => ({
      result: state.result,
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
          {result ? (
            <SearchResult />
          ) : !hasSearched ? (
            <NoSearchResult />
          ) : (
            <SearchResult />
          )}
        </div>
      </div>
    </div>
  );
}
