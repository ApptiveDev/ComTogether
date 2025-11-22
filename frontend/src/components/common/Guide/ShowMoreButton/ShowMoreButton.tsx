import styles from "./showMoreButton.module.css";
import dropdown from "@/assets/image/dropdown.svg";
import dropup from "@/assets/image/dropup.svg";

interface ShowMoreButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export default function ShowMoreButton({ isExpanded, onClick }: ShowMoreButtonProps) {
  return (
    <button className={styles.btn} onClick={onClick}>
      <span>{isExpanded ? "접기" : "자세히 보기"}</span>
      <img
        src={isExpanded ? dropup : dropdown}
        alt={isExpanded ? "dropup" : "dropdown"}
      />
    </button>
  );
}