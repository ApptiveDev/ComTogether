import React from "react";
import noSearchImage from "@/assets/image/no_search.png";
import styles from "./noSearchResult.module.css";
export default function NoSearchResult() {
  return (
    <div className={styles.noSearchContainer}>
      <img
        src={noSearchImage}
        alt="검색 결과 없음"
        className={styles.noSearchImage}
      />
    </div>
  );
}
