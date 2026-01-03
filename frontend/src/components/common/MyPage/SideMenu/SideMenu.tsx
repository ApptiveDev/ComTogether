import styles from "./SideMenu.module.css";

export default function SideMenu() {
  return (
    <div className={styles.sideMenu}>
      <div className={styles.menuItem}>
        <span className={styles.title}>관심사</span>
      </div>

      <div className={styles.menuItem}>
        <span className={styles.title}>나의 견적서</span>
      </div>

      <div className={styles.menuItem}>
        <span className={styles.title}>전문가 상담 내역</span>
      </div>
    </div>
  );
}
