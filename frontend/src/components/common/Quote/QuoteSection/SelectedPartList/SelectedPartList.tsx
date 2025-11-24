import style from "./selectedPartList.module.css";
import CategoryCard from "./CategoryCard/CategoryCard";
import SelectedItemCard from "./SelectedItemCard/SelectedItemCard";
import {
  QUOTE_CATEGORIES,
  type QuoteCategoryKey,
} from "@/constants/categories";

interface SelectedPart {
  name: string;
  price: number;
  error: boolean;
}

interface SelectedPartListProps {
  selectedParts: Record<QuoteCategoryKey, SelectedPart | null>;
  onRemovePart: (category: QuoteCategoryKey) => void;
}

export default function SelectedPartList({
  selectedParts,
  onRemovePart,
}: SelectedPartListProps) {
  return (
    <div className={style.container}>
      {QUOTE_CATEGORIES.map((category) => {
        const part = selectedParts[category];

        return (
          <div key={category} className={style.item}>
            <CategoryCard label={category} />
            {part ? (
              <SelectedItemCard
                name={part.name}
                price={part.price}
                onRemove={() => onRemovePart(category)}
                error={part.error}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
