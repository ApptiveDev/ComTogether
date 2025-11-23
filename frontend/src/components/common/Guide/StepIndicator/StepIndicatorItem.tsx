import style from './stepIndicatorItem.module.css'
import step from "@/assets/image/guide-step.svg"

interface StepIndicatorItemProps{
    isActive: boolean;
    onClick: ()=>void;
}

export default function StepIndicatorItem({isActive, onClick}: StepIndicatorItemProps){
    return(
        <div className={`${style.container} ${isActive ? style.active : ''}`} onClick={onClick}>
            <img src={step} alt="Step" />
        </div>
    )
}