import CategoryItem from "./CategoryItem";
import styles from "./categorySelector.module.css";
import { productData } from "@/components/providers/productData";

interface CategorySelectorProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({
  currentCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {productData.map((item: { id: number; name: string }) => {
          return (
            <CategoryItem
              key={item.id}
              category={item.name}
              active={currentCategory === item.name}
              onClick={() => onCategoryChange(item.name)}
            />
          );
        })} 
      </div>
      <div className={styles.line}></div>
    </div>
  );
}
