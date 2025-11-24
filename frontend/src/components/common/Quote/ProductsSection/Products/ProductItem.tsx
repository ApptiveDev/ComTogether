import styles from "./productItem.module.css";

interface partItemProps {
  image: string;
  title: string;
  lprice: string | number;
}

export default function partItem({ image, title, lprice }: partItemProps) {
  // lprice를 숫자로 변환 (문자열이거나 숫자일 수 있음)
  const price = typeof lprice === "string" ? parseInt(lprice) : lprice;
  const formattedPrice = isNaN(price) ? "0" : price.toLocaleString();

  return (
    <div className={styles.item}>
      <img src={image} alt="img" />
      <div className={styles.title}>{title}</div>
      <div className={styles.priceContainer}>
        <div className={styles.lprice}>{formattedPrice}원</div>
        <button className={styles.btn}>담기</button>
      </div>
    </div>
  );
}
