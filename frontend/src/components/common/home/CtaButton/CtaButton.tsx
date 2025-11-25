import style from "./ctaButton.module.css";

interface CtaButtonProp {
  text: string;
  color: string;
  backgroundColor: string;
  onClick?: () => void;
}
export default function CtaButton({
  text,
  color,
  backgroundColor,
  onClick,
}: CtaButtonProp) {
  return (
    <button
      className={style.button}
      style={{
        color: `${color}`,
        backgroundColor: `${backgroundColor}`,
        cursor: `pointer`,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
