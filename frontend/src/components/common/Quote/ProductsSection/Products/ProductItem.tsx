import styles from "./productItem.module.css";
import DOMPurify from "dompurify";
import { useQuoteCartContext } from "@/contexts/QuoteCartContext";
import type { Product } from "@/types/product";

interface PartItemProps {
  image: string;
  title: string;
  lprice: string | number;
  category: string;
  product: Product;
}

export default function PartItem({
  image,
  title,
  lprice,
  category,
  product,
}: PartItemProps) {
  const { addToQuote } = useQuoteCartContext();
  const price = typeof lprice === "string" ? parseInt(lprice) : lprice;
  const formattedPrice = isNaN(price) ? "0" : price.toLocaleString();

  // DOM Purify로 HTML을 안전하게 정제 (XSS 방지)
  const sanitizedTitle = DOMPurify.sanitize(title, {
    ALLOWED_TAGS: ["b", "strong", "em", "i"], // 허용할 태그만 지정
    ALLOWED_ATTR: [], // 속성은 허용하지 않음
  });

  const handleAddToQuote = () => {
    addToQuote(category, product);
  };

  return (
    <div className={styles.item}>
      <img src={image} alt="img" />
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
      />
      <div className={styles.priceContainer}>
        <div className={styles.lprice}>{formattedPrice}원</div>
        <button className={styles.btn} onClick={handleAddToQuote}>
          담기
        </button>
      </div>
    </div>
  );
}
