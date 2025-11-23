import style from './nextButton.module.css'

interface nextBtnProp{
    btnAbled: boolean;
    onClick: () => void;
    text: string
}

export default function NextButton({btnAbled, onClick, text}:nextBtnProp){
    return(
        <button disabled={!btnAbled} className={`${style.nextBtn} ${btnAbled? style.able : ''}`} onClick={onClick}>{text}</button>
    )
}