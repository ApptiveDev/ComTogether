import style from "./interestButton.module.css";
import { type ReactNode } from "react";

interface InterestButtonProps {
  onClick: () => void;
  selected: boolean;
  children: ReactNode;
}

export default function InterestButton({
  onClick,
  selected,
  children,
}: InterestButtonProps) {
  return (
    <button
      className={`${style.button} ${selected ? style.selected : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
