import Header from "../common/header/Header";
import HeroSection from "../common/home/landingPage/heroSection/HeroSection";
import IntroSection from "../common/home/landingPage/introSection/IntroSection";
import GuideSection from "../common/home/landingPage/section/GuideSection";
import ConsultingSection from "../common/home/landingPage/section/ConsultingSection";
import CommunitySection from "../common/home/landingPage/section/CommunitySection";
import BannerSection from "../common/home/landingPage/bannerSection/BannerSection";
import PromoSection from "../common/home/landingPage/PromoSection/PromotionSection";
import ClosingSection from "../common/home/landingPage/closingSection/ClosingSection";
import Footer from "../common/home/footer/Footer";
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
