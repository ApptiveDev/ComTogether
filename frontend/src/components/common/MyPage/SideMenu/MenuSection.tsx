import styles from "./MenuSection.module.css";
import MyPageButton from "../MyPageButton/MyPageButton";
import plusIcon from "@/assets/image/plus.svg";
import moreViewIcon from "@/assets/image/moreView.svg";

type MenuSectionProps = {
  title: string;
  buttonLabel: string;
  variant: "primary" | "outline";
  spacing?: number;
};

export default function MenuSection({
  title,
  buttonLabel,
  variant,
  spacing = 40,
}: MenuSectionProps) {
  return (
    <div
      className={styles.section}
      style={{ marginBottom: `${spacing}px` }}
    >
      <div className={styles.title}>{title}</div>

      <MyPageButton
        label={buttonLabel}
        variant={variant}
        icon={variant === "primary" ? plusIcon : moreViewIcon}
        width={115}
        shape={variant === "primary" ? "pill" : "round"}
      />
    </div>
  );
}
