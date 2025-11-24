import styles from "./quoteLayout.module.css";
import Header from "../common/Header/Header";
import CategorySelector from "../common/Quote/CategorySelectorSection/CategorySelector";
import PartList from "../common/Quote/ProductsSection/ProductContainer";
import QuotePart from "../common/Quote/QuoteSection/QuotePart";

export default function CompatibilityCheckLayout() {
  return (
    <div className={styles.container}>
      <Header />
      <CategorySelector />
      <div className={styles.content}>
        <PartList />
        <QuotePart />
      </div>
    </div>
  );
}
