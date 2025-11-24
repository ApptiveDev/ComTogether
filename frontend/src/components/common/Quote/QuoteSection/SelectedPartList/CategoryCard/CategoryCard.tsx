import style from './categoryCard.module.css'

interface CategoryCardProps{
  label: string;
}

export default function CategoryCard({ label }: CategoryCardProps){
    return(
        <div className={style.item}>{label}</div>
    )
}