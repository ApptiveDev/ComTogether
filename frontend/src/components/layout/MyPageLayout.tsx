import style from "./MyPageLayout.module.css";
import Header from "../common/Header/Header";
import ProfileHeader from "../common/MyPage/ProfileHeader/ProfileHeader";
import SideMenu from "../common/MyPage/SideMenu/SideMenu";
import InterestSection from "../common/MyPage/InterestSection/InterestSection";
import QuoteSection from "../common/MyPage/QuoteSection/QuoteSection";
import ConsultationSection from "../common/MyPage/ConsultationSection/ConsultationSection";

export default function MyPageLayout() {
  return (
    <div className={style.container}>
      <Header />

      <ProfileHeader
        name="김철수"
        levelLabel="초보자"
        joinDate="2024년 3월 15일"
      />

      <div className={style.content}>
        <SideMenu />
        <div className={style.divider} />

        <main className={style.main}>
          <InterestSection />
          <QuoteSection />
          <ConsultationSection />
        </main>
      </div>
    </div>
  );
}
