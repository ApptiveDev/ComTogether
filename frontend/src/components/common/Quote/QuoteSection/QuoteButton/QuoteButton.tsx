import style from "./quoteButton.module.css";

interface estimateBtnProp {
  content: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function QuoteButton({
  content,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
}: estimateBtnProp) {
  const buttonClass = [style.btn, style[variant], style[size]]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
