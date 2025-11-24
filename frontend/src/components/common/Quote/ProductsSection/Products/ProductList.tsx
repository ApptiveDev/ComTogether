import styles from "./productList.module.css";
import PartItem from "./ProductItem";
import type { Product } from "@/types/product";

interface partPageProps {
  pageItems: Product[];
  category: string;
}

export default function PartPage({ pageItems, category }: partPageProps) {
  return (
    <div className={styles.container}>
      {pageItems?.map((product) => (
        <PartItem
          key={product.product_id}
          image={product.image}
          title={product.title}
          lprice={product.lprice}
          category={category}
          product={product}
        />
      ))}
    </div>
  );
}
