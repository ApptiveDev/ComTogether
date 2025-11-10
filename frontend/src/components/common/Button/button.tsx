import style from "./button.module.css";

interface btnProp {
  color: string;
  backgroundColor: string;
  content: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Button({
  color,
  backgroundColor,
  content,
  onClick,
  disabled = false,
  variant = "primary",
  size = "xl", // 기존 크기와 유사한 xl 사용
}: btnProp) {
  // 새로운 variant 시스템 사용 시 기본 색상 무시
  const useCustomColors = !variant || variant === "primary";

  const buttonClass = [
    style.btn,
    style[variant],
    style[size],
    disabled && style.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  const customStyle = useCustomColors
    ? {
        color: `${color}`,
        backgroundColor: disabled ? "#cccccc" : `${backgroundColor}`,
        cursor: disabled ? "not-allowed" : "pointer",
      }
    : {};

  return (
    <button
      className={buttonClass}
      style={customStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
