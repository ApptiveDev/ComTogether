import style from './guidePartButton.module.css'

interface guidePartButtonProps{
    img: string;
    content: string;
    isActive: boolean;
    onClick: () => void;
}

export default function GuidePartButton({img, content, isActive, onClick}:guidePartButtonProps){
    return(
        <button className={`${style.button} ${isActive? style.active : ''}`} onClick={onClick}>
            <img src={img} alt="part"/>
            <div className={style.content}>{content}</div>
        </button>
    )
}