import image from "@/assets/image/image_temp.png";
import Section from "./Section";

export default function ConsultingSection() {
  return (
    <Section
      title="전문가 상담"
      description={`나에게 꼭 맞는 PC 전문가,\n이제 조립형 PC 구매도\n어렵지 않아요`}
      subtext={`수많은 정보 속에서 헤매지 마세요.\n관심사에 맞춘 전문가가 1:1 채팅으로 함께하며,\n처음부터 끝까지 안심할 수 있는 구매 과정을 제공합니다.`}
      imageSrc={image}
      color="#f6f6f6"
    />
  );
}
