import image from "@/assets/image/image_temp.png";
import Section from "./Section";

export default function CommunitySection() {
  return (
    <Section
      title="커뮤니티"
      description={`신뢰할 수 있는\n컴투게더만의 커뮤니티에서\n재밌고 유익하게 소통해요`}
      subtext={`컴투게더 커뮤니티에서는 초보자도 활동을 통해\n레벨업하며 숙련자로 성장할 수 있고,\n함께 경험을 나누며 재미있게 소통할 수 있어요.`}
      imageSrc={image}
      color="#fcfcfc"
    />
  );
}
