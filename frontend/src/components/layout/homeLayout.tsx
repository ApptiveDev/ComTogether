import Header from "../common/header/Header";
import HeroSection from "../common/home/LandingPage/HeroSection/HeroSection";
import IntroSection from "../common/home/LandingPage/IntroSection/IntroSection";
import GuideSection from "../common/home/LandingPage/section/GuideSection";
import ConsultingSection from "../common/home/LandingPage/section/ConsultingSection";
import CommunitySection from "../common/home/LandingPage/section/CommunitySection";
import BannerSection from "../common/home/LandingPage/BannerSection/BannerSection";
import PromoSection from "../common/home/LandingPage/PromoSection/PromotionSection";
import ClosingSection from "../common/home/LandingPage/ClosingSection/ClosingSection";
import Footer from "../common/home/Footer/Footer";
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
