import noSearchImage from "../../../../assets/image/no_search.png";
import styles from "./noSearchResult.module.css";

interface NoSearchResultProps {
  message?: string;
}

export default function NoSearchResult({ message }: NoSearchResultProps) {
  return (
    <div className={styles.noSearchContainer}>
      <img
        src={noSearchImage}
        alt="검색 결과 없음"
        className={styles.noSearchImage}
      />
      {message && <p>{message}</p>}
    </div>
  );
}
