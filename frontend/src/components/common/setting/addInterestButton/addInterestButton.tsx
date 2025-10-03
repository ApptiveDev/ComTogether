import style from './addInterestButton.module.css'

interface addInterestBtnProp{
    onClick: () => void;
}

export default function AddInterestButton({ onClick }: addInterestBtnProp){
    return(
        <button className={style.addInterestBtn} onClick={onClick}>+ 직접 추가</button>
    )
}