import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = "medium",
  color = "#ff5525",
  text,
}: LoadingSpinnerProps) {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.spinner} ${styles[size]}`}
        style={{ borderTopColor: color }}
      ></div>
      {text && <div className={styles.text}>{text}</div>}
    </div>
  );
}