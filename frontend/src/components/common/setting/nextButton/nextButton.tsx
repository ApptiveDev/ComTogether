import style from './nextButton.module.css'

interface nextBtnProp{
    btnAbled: boolean;
    onClick: () => void;
}

export default function NextButton({btnAbled, onClick}:nextBtnProp){
    return(
        <button disabled={!btnAbled} className={`${style.nextBtn} ${btnAbled? style.able : ''}`} onClick={onClick}>다음</button>
    )
}