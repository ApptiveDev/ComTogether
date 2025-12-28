import styles from "./ProfileHeader.module.css";
import profileImg from "@/assets/image/profile.svg";

type ProfileHeaderProps = {
  name: string;
  levelLabel: string;
  joinDate: string;
};

export default function ProfileHeader({
  name,
  levelLabel,
  joinDate,
}: ProfileHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        <img src={profileImg} alt="프로필 이미지" className={styles.avatar} />
        <span className={styles.badge}>{levelLabel}</span>
      </div>

      <h1 className={styles.name}>{name}<span className={styles.suffix}>님</span></h1>
      <p className={styles.date}>가입일 · {joinDate}</p>
    </div>
  );
}
