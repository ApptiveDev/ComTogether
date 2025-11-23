import Header from "../common/Header/Header";
import HeroSection from "../common/home/LandingPage/HeroSection/HeroSection";
import IntroSection from "../common/home/LandingPage/IntroSection/IntroSection";
import GuideSection from "../common/home/LandingPage/Section/GuideSection";
import ConsultingSection from "../common/home/LandingPage/Section/ConsultingSection";
import CommunitySection from "../common/home/LandingPage/Section/CommunitySection";
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
