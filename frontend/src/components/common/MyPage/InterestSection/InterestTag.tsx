import styles from "./interestSection.module.css";

interface TagProps {
  icon?: string;
  label: string;
  onRemove?: () => void;
}

export default function InterestTag({ icon, label, onRemove }: TagProps) {
  return (
    <div className={styles.tag}>
      {icon && <img src={icon} alt="" aria-hidden className={styles.icon} />}
      <span>{label}</span>
      {onRemove && (
        <button
          className={styles.remove}
          onClick={onRemove}
          aria-label={`${label} 삭제`}
        >
          ×
        </button>
      )}
    </div>
  );
}
