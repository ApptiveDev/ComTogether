import style from './button.module.css'

interface btnProp{
    color: string;
    backgroundColor: string;
    content: string;
    onClick: () => void;
}

export default function Button({color, backgroundColor, content, onClick}:btnProp){
    return(
        <button className={style.btn} 
        style={{color: `${color}`, backgroundColor: `${backgroundColor}`}}
        onClick={onClick}>{content}</button>
    )
}