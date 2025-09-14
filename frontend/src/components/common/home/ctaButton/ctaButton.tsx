import style from './ctaButton.module.css'

interface CtaButtonProp{
    text:string;
    color:string;
    backgroundColor:string;
}
export default function CtaButton({text, color, backgroundColor}:CtaButtonProp){
    return(
        <button className={style.button} style={{color:`${color}`, backgroundColor:`${backgroundColor}`}}>{text}</button>
    )
}