import style from './secondSettingLayout.module.css'
import StepHeader from '../common/setting/stepHeader/stepHeader'
import stepImg from '@/assets/image/second-step-status.svg'
import InterestSelector from '../common/setting/interestSelector/interestSelector'
import NextButton from '../common/setting/nextButton/nextButton'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function SecondSettingLayout(){
    const navigate = useNavigate();
    const handleNext = () => {
        navigate('/home')
    }

    const [count, setCount] = useState(0);

    return(
        <div className={style.container}>
            <div className={style.stepContent}>
                <StepHeader
                step="STEP 02"
                image={stepImg}
                question="관심사가 무엇인가요?"
                />
                <InterestSelector
                    count={count}
                    setCount={setCount}
                />
            </div>
            <div className={style.interestFooter}>
                <div className={style.interestCount}>선택된 관심사: {count}개</div>
                <NextButton
                btnAbled={count > 0}
                onClick={handleNext}
                text="완료"
                />
            </div>
        </div>
    )
}