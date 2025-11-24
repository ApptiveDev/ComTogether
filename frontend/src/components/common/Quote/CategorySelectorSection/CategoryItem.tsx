import styles from './categoryItem.module.css'

interface categoryItemProps{
    category: string;
    active: boolean;
    onClick: () => void;
}

export default function CategoryItem({category, active, onClick}: categoryItemProps){
    return(
        <div className={`${styles.item} ${active ? styles.active : ''}`} onClick={onClick}>{category}</div>
    )
}