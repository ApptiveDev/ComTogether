import styles from "./pagination.module.css";
import { usePartListStore } from "@/stores/usePartListStore";
import leftArrow from "@/assets/image/leftArrow.svg";
import rightArrow from "@/assets/image/rightArrow.svg";
import type { Dispatch, SetStateAction } from "react";

interface paginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange?: Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  totalPages,
  currentPage: propCurrentPage,
  onPageChange,
}: paginationProps) {
  const { currentPage: storeCurrentPage, setCurrentPage: storeSetCurrentPage } =
    usePartListStore();
  const currentPage = propCurrentPage ?? storeCurrentPage;
  const setCurrentPage = onPageChange ?? storeSetCurrentPage;

  const windowSize = 10;
  //1-10, 11-20, 21-30...
  const startPage = Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
  const endPage = Math.min(startPage + windowSize - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.prev}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <img src={leftArrow} alt="prev" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.btn} ${
            page === currentPage ? styles.active : ""
          }`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={styles.next}
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <img src={rightArrow} alt="next" />
      </button>
    </div>
  );
}
