import style from "./contentArea.module.css";
import categoryImg from "@/assets/image/guideImg.png";
import { useGuidePart } from "../../../../stores/useGuidePart";
import data from "../../../../dummy/dummy_guide.json";
import category from "@/assets/image/guideNav/category.svg";
import mainboard from "@/assets/image/guideNav/mainboard.svg";
import GuidePartButton from "../guidePartButton/guidePartButton";
import ShowMoreButton from "../showMoreButton/showMoreButton";
import info from "@/assets/image/info.svg";
import check from "@/assets/image/check.svg";
import warning from "@/assets/image/warning.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

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
  const { selectCategory, contentPart, setContentPart, showMore, setShowMore } = useGuidePart();
  const currentData = data.find((item) => item.category === selectCategory);
  gsap.registerPlugin(ScrollTrigger);

  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 스크롤 애니메이션 구현
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    if (!content ||!container || !image || !showMore) return;

    const imageHeight = image.clientHeight;

    gsap.fromTo(
      image,
      { opacity: 1 },//애니메이션 시작 상태
      {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: content,
          scroller: container,
          start: `top ${imageHeight}px`, //trigger 요소의 top이 scroll 대상의 imageHeight 위치에 도달했을 때 애니메이션 시작
          end: `+=${imageHeight}px`,
          scrub: true, //스크롤 위치에 따라 애니메이션 진행
        },
      }
    );
  }, [showMore]);

  if (!currentData) {
    return <div>오류 발생</div>;
  }

  const currentPart = currentData.content.find(
    (item) => item.title === contentPart
  );

  return (
    <div className={style.container} ref={containerRef}>
      <div className={style.imageWrapper} ref={imageRef}>
        <img
          src={imageMap[selectCategory]}
          alt="category"
          className={style.categoryImg}
        />
      </div>

      <div className={style.contentWrapper} ref={contentRef}>
        <div className={`${style.content} ${showMore ? style.showMore : ""}`}>
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
                  setShowMore(false);
                }}
              />
            ))}
          </div>
          <div className={style.textContent}>
            <div className={style.description}>{currentPart?.description}</div>
            {showMore && (
              <div className={style.detail}>
                {currentPart?.details.map(detail => (
                  <div key={detail.title} className={style.detailItem}>
                    <div className={style.detailItemTitle}>{detail.title}</div>
                    <div className={style.detailItemDesc}>{detail.description}</div>
                  </div>
                ))}
              </div>
            )}
            <ShowMoreButton
              isExpanded={showMore}
              onClick={() => setShowMore(!showMore)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
