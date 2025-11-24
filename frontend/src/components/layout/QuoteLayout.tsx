import styles from "./quoteLayout.module.css";
import Header from "../common/Header/Header";
import CategorySelector from "../common/Quote/CategorySelectorSection/CategorySelector";
import PartList from "../common/Quote/ProductsSection/ProductContainer";
import QuotePart from "../common/Quote/QuoteSection/QuotePart";
import { QuoteCartProvider } from "@/contexts/QuoteCartContext";
import { useState } from "react";

export default function CompatibilityCheckLayout() {
  const [currentCategory, setCurrentCategory] = useState("CPU");

  return (
    <QuoteCartProvider>
      <div className={styles.container}>
        <Header />
        <CategorySelector
          currentCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
        />
        <div className={styles.content}>
          <PartList currentCategory={currentCategory} />
          <QuotePart />
        </div>
      </div>
    </QuoteCartProvider>
  );
}
