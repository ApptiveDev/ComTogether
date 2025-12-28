import styles from "./ConsultationCard.module.css";
import type { Consultation } from "./mock";
import profileIcon from "@/assets/image/profile.svg";
import chatIcon from "@/assets/image/chat.svg";
import MyPageButton from "../MyPageButton/MyPageButton";

type Props = {
  data: Consultation;
};

export default function ConsultationCard({ data }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <div className={styles.title}>{data.title}</div>
        <div className={styles.date}>{data.date}</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.right}>
        <div className={styles.expert}>
          <img
            src={profileIcon}
            alt=""
            aria-hidden
            className={styles.avatar}
          />
          <span className={styles.name}>{data.expertName}</span>
        </div>

        <div className={styles.buttons}>
          <MyPageButton
            label="전문가 프로필"
            variant="outline"
            width={140}
            height={32}
          />

          <MyPageButton
            label="상담하기"
            variant="primary"
            icon={chatIcon}
            width={140}
            height={36}
          />
        </div>
      </div>
    </div>
  );
}
