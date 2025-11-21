import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large" | "extraLarge";
  color?: string;
  text?: string;
  variant?: "spinner" | "pulse" | "dots";
  thickness?: number;
}

export default function LoadingSpinner({
  size = "medium",
  color = "#ff5525",
  text,
  variant = "spinner",
  thickness,
}: LoadingSpinnerProps) {
  const renderSpinner = () => {
    switch (variant) {
      case "pulse":
        return (
          <div
            className={`${styles.pulse} ${styles[size]}`}
            style={{ backgroundColor: color }}
          />
        );
      case "dots":
        return (
          <div className={styles.dots}>
            <div style={{ backgroundColor: color }} />
            <div style={{ backgroundColor: color }} />
            <div style={{ backgroundColor: color }} />
          </div>
        );
      default:
        return (
          <div
            className={`${styles.spinner} ${styles[size]}`}
            style={{
              borderTopColor: color,
              ...(thickness && {
                borderWidth: `${thickness}px`,
                borderTopWidth: `${thickness}px`,
              }),
            }}
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      {renderSpinner()}
      {text && <div className={styles.text}>{text}</div>}
    </div>
  );
}
