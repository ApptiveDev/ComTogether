import styles from "./productList.module.css";
import PartItem from "./ProductItem";
import type { item } from "../ProductContainer";

interface partPageProps {
  pageItems: item[];
}

export default function PartPage({ pageItems }: partPageProps) {
  return (
    <div className={styles.container}>
      {pageItems?.map((item) => (
        <PartItem
          key={item.id}
          image={item.image || ""}
          title={item.name}
          lprice={item.price}
        />
      ))}
    </div>
  );
}
