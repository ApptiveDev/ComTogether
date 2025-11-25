import style from "./quoteButton.module.css";

interface estimateBtnProp {
  content: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function QuoteButton({
  content,
  onClick,
  variant = "primary",
  size = "md",
}: estimateBtnProp) {
  const buttonClass = [style.btn, style[variant], style[size]]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} onClick={onClick}>
      {content}
    </button>
  );
}
