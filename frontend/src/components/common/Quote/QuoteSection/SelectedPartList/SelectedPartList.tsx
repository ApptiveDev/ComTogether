import style from "./selectedPartList.module.css";
import CategoryCard from "./CategoryCard/CategoryCard";
import SelectedItemCard from "./SelectedItemCard/SelectedItemCard";

const categories = [
  "CPU",
  "메인보드",
  "RAM",
  "그래픽카드",
  "저장장치",
  "파워 서플라이",
  "케이스",
  "쿨러/팬",
  "기타 입출력 장치",
] as const;

type CategoryKey = (typeof categories)[number];

const selectedParts: Record<
  CategoryKey,
  { name: string; price: number; error: boolean } | null
> = {
  CPU: { name: "i3-12100", price: 100000, error: true },
  메인보드: { name: "ASUS B760M-A", price: 150000, error: true },
  RAM: { name: "DDR4 16GB", price: 52000, error: true },
  그래픽카드: { name: "RTX 3060", price: 380000, error: true },
  저장장치: { name: "970 EVO Plus", price: 69000, error: false },
  "파워 서플라이": { name: "Classic II 700W", price: 75000, error: true },
  케이스: { name: "NCORE SIXFAN", price: 42000, error: false },
  "쿨러/팬": null,
  "기타 입출력 장치": { name: "로지텍 K120", price: 14000, error: false },
};

export default function SelectedPartList() {
  return (
    <div className={style.container}>
      {categories.map((category) => {
        const part = selectedParts[category as CategoryKey];

        return (
          <div key={category} className={style.item}>
            <CategoryCard label={category} />
            {part ? (
              <SelectedItemCard
                name={part.name}
                price={part.price}
                onRemove={() => {}}
                error={part.error}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
