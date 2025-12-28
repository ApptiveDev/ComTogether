import styles from "./SideMenu.module.css";
import MenuSection from "./MenuSection";

export default function SideMenu() {
  return (
    <div className={styles.sideMenu}>
      <MenuSection
        title="관심사"
        buttonLabel="추가하기"
        variant="primary"
        spacing={60}  
      />

      <MenuSection
        title="나의 견적서"
        buttonLabel="더보기"
        variant="outline"
        spacing={190} 
      />

      <MenuSection
        title="전문가 상담 내역"
        buttonLabel="더보기"
        variant="outline"
        spacing={100}  
      />
    </div>
  );
}
