import Header from "../common/header/header";
import HeroSection from "../common/home/landingPage/heroSection/heroSection";
import IntroSection from "../common/home/landingPage/introSection/introSection";
import GuideSection from "../common/home/landingPage/section/guideSection";
import ConsultingSection from "../common/home/landingPage/section/consultingSection";
import CommunitySection from "../common/home/landingPage/section/communitySection";
import BannerSection from "../common/home/landingPage/bannerSection/bannerSection";
import PromoSection from "../common/home/landingPage/PromoSection/promotionSection";
import ClosingSection from "../common/home/landingPage/closingSection/closingSection";
import Footer from "../common/home/footer/footer";
import style from "./homeLayout.module.css";

export default function HomeLayout() {
  return (
    <div className={style.container}>
      <Header />
      <HeroSection />
      <IntroSection />
      <GuideSection />
      <ConsultingSection />
      <CommunitySection />
      <BannerSection />
      <PromoSection />
      <ClosingSection />
      <Footer />
    </div>
  );
}
