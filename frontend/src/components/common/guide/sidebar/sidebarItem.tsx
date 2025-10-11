import style from './sidebarItem.module.css'
import arrow from "../../../../assets/image/guideNav/arrowRight.svg"

interface SidebarItemProps{
    category: string;
    img: string;
    onClick: ()=>void;
    isSelected: boolean;
}

export default function SidebarItem({ category, img, onClick, isSelected }: SidebarItemProps){
    return(
        <div className={`${style.container} ${isSelected ? style.selected : ''}`} onClick={onClick}>
            <div className={style.content}>
                <img src={img} alt="category icon" />
                <div className={style.category}>{category}</div>
            </div>
            <img src={arrow} alt="arrow icon" />
        </div>
    )
}