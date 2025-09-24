import style from './settingLayout.module.css'
import StepHeader from '../common/setting/stepHeader/stepHeader'
import SkillLevelCard from '../common/setting/skillLevelCard/skillLevelCard'
import NextButton from '../common/setting/nextButton/nextButton'
import beginner from '@/assets/image/beginner.svg'
import expert from '@/assets/image/expert.svg'
import stepImg from '@/assets/image/step-status.svg'
import { useNavigate } from 'react-router'


import {useState, useEffect} from "react"

export default function SettingLayout(){
    const [abled, setAbled] = useState(false);
    const [checkBeginner, SetCheckBeginner] = useState(false);
    const [checkExpert, SetCheckExpert] = useState(false);

    const navigate = useNavigate();
    
    
    useEffect(()=>{
        if (checkBeginner||checkExpert){
            setAbled(true);
        }
    },[checkBeginner, checkExpert]);

    return(
        <div className={style.container}>
            <StepHeader
            step="STEP 01"
            image={stepImg}
            question="컴퓨터에 대한 숙련도가 어떻게 되시나요?"
            />
            <div className={style.cards}>
                <SkillLevelCard
                level="초보자"
                description={`컴퓨터 사용이 익숙하지 않고\n기본적이 도움이 필요해요.`}
                image={beginner}
                onClick={()=>{
                    SetCheckBeginner(true);
                    SetCheckExpert(false);
                }}
                check={checkBeginner}
                />
                <SkillLevelCard
                level="전문가"
                description={`컴퓨터 사용이 익숙하고\n조립형 PC에 대한 전문지식이 충분해요.`}
                image={expert}
                onClick={()=>{
                    SetCheckExpert(true);
                    SetCheckBeginner(false);
                }}
                check={checkExpert}
                />
            </div>
            <div className={style.btnContainer}>
                <NextButton
                btnAbled={abled}
                onClick={()=>{
                    navigate("/second-setting")
                }}
                />       
            </div>
        </div>
    )
}