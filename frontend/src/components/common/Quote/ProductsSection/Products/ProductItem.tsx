import styles from "./productItem.module.css";
import DOMPurify from "dompurify";

interface partItemProps {
  image: string;
  title: string;
  lprice: string | number;
}

export default function partItem({ image, title, lprice }: partItemProps) {
  const price = typeof lprice === "string" ? parseInt(lprice) : lprice;
  const formattedPrice = isNaN(price) ? "0" : price.toLocaleString();

  // DOMPurify로 HTML을 안전하게 정제 (XSS 방지)
  const sanitizedTitle = DOMPurify.sanitize(title, {
    ALLOWED_TAGS: ["b", "strong", "em", "i"], // 허용할 태그만 지정
    ALLOWED_ATTR: [], // 속성은 허용하지 않음
  });

  return (
    <div className={styles.item}>
      <img src={image} alt="img" />
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
      />
      <div className={styles.priceContainer}>
        <div className={styles.lprice}>{formattedPrice}원</div>
        <button className={styles.btn}>담기</button>
      </div>
    </div>
  );
}
