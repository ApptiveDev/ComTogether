import style from "./button.module.css";

interface btnProp {
  color: string;
  backgroundColor: string;
  content: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({
  color,
  backgroundColor,
  content,
  onClick,
  disabled = false,
}: btnProp) {
  return (
    <button
      className={style.btn}
      style={{
        color: `${color}`,
        backgroundColor: disabled ? "#cccccc" : `${backgroundColor}`,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
