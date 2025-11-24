import CategoryItem from "./CategoryItem";
import styles from "./categorySelector.module.css";
import { usePartListStore } from "@/stores/usePartListStore";
import { productData } from "@/components/providers/productData";

export default function CategorySelector() {
  const {
    currentCategory,
    setCurrentCategory,
    setCurrentPage,
    setSearchResult,
    setInputValue,
  } = usePartListStore();
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {productData.map((item: { id: number; name: string }) => {
          return (
            <CategoryItem
              key={item.id}
              category={item.name}
              active={currentCategory === item.name}
              onClick={() => {
                setCurrentCategory(item.name);
                setCurrentPage(1);
                setSearchResult([]);
                setInputValue("");
              }}
            />
          );
        })}
      </div>
      <div className={styles.line}></div>
    </div>
  );
}
