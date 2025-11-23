import style from "./sidebar.module.css";
import { useGuidePart } from "../../../../stores/useGuidePart";
import SidebarItem from "./SidebarItem";
import { useGuideData } from "../../../../api/Guide";
import type { GuideData } from "../../../../types/guide";
import category from "@/assets/image/guideNav/category.svg";
import mainboard from "@/assets/image/guideNav/mainboard.svg";

// API 카테고리 이름 (소문자) -> 한글 표시명 매핑
const categoryNameMap: Record<string, string> = {
  cpu: "CPU",
  mainboard: "메인보드",
  ram: "RAM",
  gpu: "그래픽 카드",
  storage: "저장 장치",
  power: "파워 서플라이",
  case: "케이스",
  cooler: "쿨러/팬",
  etc: "기타 입출력 장치",
};

// 한글 카테고리명 -> 아이콘 매핑
const iconMap: Record<string, string> = {
  CPU: category,
  메인보드: mainboard,
  RAM: category,
  "그래픽 카드": category,
  "저장 장치": category,
  "파워 서플라이": category,
  케이스: category,
  "쿨러/팬": category,
  "기타 입출력 장치": category,
};

export default function Sidebar() {
  const {
    selectCategory,
    setCurrentStep,
    setSelectCategory,
    setContentPart,
    setShowMore,
  } = useGuidePart();

  // useGuideData 훅으로 데이터 가져오기
  const { data: allGuides, isLoading } = useGuideData(); // 로딩 중일 때
  if (isLoading) {
    return <div className={style.container}>로딩 중...</div>;
  }

  // 데이터가 없을 때
  if (!allGuides) {
    return <div className={style.container}>데이터가 없습니다.</div>;
  }

  const guides = allGuides as GuideData[];

  return (
    <div className={style.container}>
      {guides.map((item) => {
        // API 카테고리명을 한글 표시명으로 변환
        const displayName =
          categoryNameMap[item.category.toLowerCase()] || item.category;

        return (
          <SidebarItem
            key={item.id}
            category={displayName}
            img={iconMap[displayName]}
            onClick={() => {
              setSelectCategory(item.category);
              setCurrentStep(item.id);
              setContentPart("개요");
              setShowMore(false);
            }}
            isSelected={
              selectCategory.toLowerCase() === item.category.toLowerCase()
            }
          />
        );
      })}
    </div>
  );
}
