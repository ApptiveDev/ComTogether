import React from "react";
import ArrowDown from "../../../../assets/image/icon/arrowDown";
import styles from "./moreButton.module.css";

interface MoreButtonProps {
  showMore: boolean;
  onClick: () => void;
}

export default function MoreButton({ showMore, onClick }: MoreButtonProps) {
  if (showMore) return null;
  return (
    <button className={styles.moreBtn} onClick={onClick}>
      더보기
      <span
        style={{
          fontSize: 18,
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
        }}
      >
        <ArrowDown />
      </span>
    </button>
  );
}
