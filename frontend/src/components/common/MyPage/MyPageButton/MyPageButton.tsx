import styles from "./MyPageButton.module.css";

type MyPageButtonProps = {
  label: string;
  variant: "primary" | "outline";
  icon?: string;
  width?: number;
  height?: number; 
  shape?: "round" | "pill";
  onClick?: () => void;
};

export default function MyPageButton({
  label,
  variant,
  icon,
  width = 140,
  height,
  shape = "round",
  onClick,
}: MyPageButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[shape]}`}
      style={{
        width,
        ...(height && { height }), //있을 때만 override
      }}
      onClick={onClick}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          aria-hidden
          className={styles.icon}
        />
      )}
      {label}
    </button>
  );
}
