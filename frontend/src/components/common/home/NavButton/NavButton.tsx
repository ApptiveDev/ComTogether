import style from "./navButton.module.css";

interface NavButtonProps {
  text: string;
  onClick: () => void;
}
export default function NavButton({ text, onClick }: NavButtonProps) {
  return (
    <button className={style.navBtn} onClick={onClick}>
      {text}
    </button>
  );
}
