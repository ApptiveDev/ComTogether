import style from './secondSettingLayout.module.css'
import StepHeader from '../common/stepHeader/stepHeader'
import stepImg from '@/assets/image/second-step-status.svg'

export default function SecondSettingLayout(){
    return(
        <div className={style.container}>
            <StepHeader
            step="STEP 02"
            image={stepImg}
            question="관심사가 무엇인가요?"
            />
        </div>
    )
}