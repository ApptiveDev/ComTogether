import style from "./contentArea.module.css";
import categoryImg from "@/assets/image/guideImg.png";
import { useGuidePart } from "../../../../stores/useGuidePart";
import data from "../../../../dummy/dummy_guide.json";
import category from "@/assets/image/guideNav/category.svg";
import mainboard from "@/assets/image/guideNav/mainboard.svg";
import GuidePartButton from "../guidePartButton/guidePartButton";
import info from "@/assets/image/info.svg";
import check from "@/assets/image/check.svg";
import warning from "@/assets/image/warning.svg";
import dropdown from "@/assets/image/dropdown.svg";

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

const imageMap: Record<string, string> = {
  CPU: categoryImg,
  메인보드: categoryImg,
  RAM: categoryImg,
  "그래픽 카드": categoryImg,
  "저장 장치": categoryImg,
  "파워 서플라이": categoryImg,
  케이스: categoryImg,
  "쿨러/팬": categoryImg,
  "기타 입출력 장치": categoryImg,
};

const partIconMap: Record<string, string> = {
  개요: info,
  "주요 특징": check,
  유의사항: warning,
  "초보자용 설명": warning,
};

export default function ContentArea() {
  const { selectCategory, contentPart, setContentPart } = useGuidePart();
  const currentData = data.find((item) => item.category === selectCategory);

  if (!currentData) {
    return <div>오류 발생</div>;
  }

  const currentPart = currentData.content.find(
    (item) => item.title === contentPart
  );

  return (
    <div className={style.container}>
      <img
        src={imageMap[selectCategory]}
        alt="category icon"
        className={style.categoryImg}
      />
      <div className={style.content}>
        <div className={style.title}>
          <img src={iconMap[selectCategory]} alt="category icon" />
          <div className={style.category}>{selectCategory}</div>
          <div className={style.order}>조립순서 #{currentData.id}</div>
        </div>
        <div className={style.btnContainer}>
          {currentData.content.map((item) => (
            <GuidePartButton
              key={item.title}
              img={partIconMap[item.title]}
              content={item.title}
              isActive={item.title === contentPart}
              onClick={() => {
                setContentPart(item.title);
              }}
            />
          ))}
        </div>
        <div className={style.textContent}>
          <div className={style.text}>{currentPart?.text}</div>
          <div className={style.btn}>
            <span>자세히보기</span>
            <img src={dropdown} alt="dropdown" />
          </div>
        </div>
      </div>
    </div>
  );
}
