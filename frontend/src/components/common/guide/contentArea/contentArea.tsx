import style from "./contentArea.module.css";
import categoryImg from "@/assets/image/guideImg.png";
import { useGuidePart } from "../../../../stores/useGuidePart";
import { useGuideData } from "../../../../api/guide";
import type { GuideData } from "../../../../types/guide";
import category from "@/assets/image/guideNav/category.svg";
import mainboard from "@/assets/image/guideNav/mainboard.svg";
import GuidePartButton from "../guidePartButton/GuidePartButton";
import ShowMoreButton from "../showMoreButton/ShowMoreButton";
import info from "@/assets/image/info.svg";
import check from "@/assets/image/check.svg";
import warning from "@/assets/image/warning.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";
import "../../../../styles/globals/markdown.css";

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
  const { selectCategory, contentPart, setContentPart, showMore, setShowMore } =
    useGuidePart();

  // useGuideData 훅으로 데이터 가져오기
  const { data: allGuides, isLoading, error } = useGuideData();

  gsap.registerPlugin(ScrollTrigger);

  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 현재 선택된 카테고리의 데이터 찾기
  const guides = allGuides as GuideData[] | undefined;
  const currentData = guides?.find(
    (item) => item.category.toLowerCase() === selectCategory.toLowerCase()
  );

  // 스크롤 애니메이션 구현
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const image = imageRef.current;

    if (!content || !container || !image || !currentData) return;

    // 이전 ScrollTrigger 인스턴스 정리
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // showMore가 true일 때만 애니메이션 생성
    if (showMore) {
      const imageHeight = image.clientHeight;

      gsap.fromTo(
        image,
        { opacity: 1 }, //애니메이션 시작 상태
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
    } else {
      // showMore가 false일 때는 opacity를 1로 리셋
      gsap.set(image, { opacity: 1 });
    }

    // cleanup 함수
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [showMore, currentData]);

  // 로딩 상태 처리
  if (isLoading) {
    return <div className={style.container}>로딩 중...</div>;
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={style.container}>
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!allGuides || !currentData) {
    return <div className={style.container}>데이터가 없습니다.</div>;
  }

  // API 카테고리명을 한글 표시명으로 변환
  const displayName =
    categoryNameMap[currentData.category.toLowerCase()] || currentData.category;

  const currentPart = currentData.content.find(
    (item) => item.title === contentPart
  );

  // 마크다운 텍스트의 불필요한 들여쓰기 제거
  const cleanMarkdown = (text: string) => {
    if (!text) return "";

    // 각 줄의 앞쪽 공백을 제거
    return text
      .split("\n")
      .map((line) => line.trimStart())
      .join("\n")
      .trim();
  };

  return (
    <div className={style.container} ref={containerRef}>
      <div className={style.imageWrapper} ref={imageRef}>
        <img
          src={imageMap[displayName]}
          alt="category"
          className={style.categoryImg}
        />
      </div>

      <div className={style.contentWrapper} ref={contentRef}>
        <div className={`${style.content} ${showMore ? style.showMore : ""}`}>
          <div className={style.title}>
            <img src={iconMap[displayName]} alt="category icon" />
            <div className={style.category}>{displayName}</div>
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
            <div className={`${style.description} markdown-content`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {cleanMarkdown(currentPart?.description || "")}
              </ReactMarkdown>
            </div>
            {showMore && (
              <div className={style.detail}>
                {currentPart?.details.map((detail) => (
                  <div key={detail.title} className={style.detailItem}>
                    <div className={style.detailItemTitle}>{detail.title}</div>
                    <div className={`${style.detailItemDesc} markdown-content`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {cleanMarkdown(detail.description)}
                      </ReactMarkdown>
                    </div>
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
