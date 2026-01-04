import styles from "./ProfileHeader.module.css";
import profileImg from "@/assets/image/profile.svg";

type ProfileHeaderProps = {
  name?: string | null;
  levelLabel?: string;
  joinDate?: string | null;
  profileImageUrl?: string | null;
  isLoading?: boolean;
};

export default function ProfileHeader({
  name,
  levelLabel,
  joinDate,
  profileImageUrl,
  isLoading,
}: ProfileHeaderProps) {
  const displayName = name ?? "회원";
  const level = levelLabel ?? "회원";
  const joinDateText = joinDate
    ? `가입일 · ${joinDate}`
    : "가입일 정보를 준비 중입니다.";
  const avatarSrc = profileImageUrl || profileImg;

  return (
    <div className={styles.container} aria-busy={isLoading}>
      <div className={styles.avatarWrapper}>
        <img src={avatarSrc} alt="프로필 이미지" className={styles.avatar} />
        <span className={styles.badge}>{level}</span>
      </div>

      <h1 className={styles.name}>
        {displayName}
        <span className={styles.suffix}>님</span>
      </h1>
      <p className={styles.date}>{joinDateText}</p>
    </div>
  );
}
