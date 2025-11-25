import style from './selectedItemCard.module.css'
import remove from '@/assets/image/remove.svg'

interface SelectedItemCardProps {
  name: string;
  price: number;
  onRemove: () => void;
  error: boolean
}

export default function SelectedItemCard({
  name,
  price,
  onRemove,
  error
}: SelectedItemCardProps) {
  return (
    <div className={`${style.card} ${error? style.error : ''}`}>
      <div className={style.name}>{name}</div>

      <div className={style.right}>
        <div className={style.price}>{price.toLocaleString()}원</div>
        <button className={style.removeBtn} onClick={onRemove}>
            <img src={remove} alt="remove"/>
        </button>
      </div>
    </div>
  );
}