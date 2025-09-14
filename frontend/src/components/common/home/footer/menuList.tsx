import style from './menuList.module.css'

interface menuListProp{
    title:string;
    items:string[];
}

export default function MenuList({title, items}:menuListProp){
    return(
        <div className={style.menuList}>
            <div className={style.menuTitle}>{title}</div>
            <div className={style.menuItem}>
                {items.map((item,index)=>(
                    <div key={index}>{item}</div>
                ))}
            </div>
        </div>
    )
}