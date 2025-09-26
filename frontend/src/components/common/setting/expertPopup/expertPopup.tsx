import style from './expertPopup.module.css'
import verifyIcon from '@/assets/image/verify.svg'
import Button from '../../Button/button'
import { useNavigate } from 'react-router'

interface expertPopupProp{
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className: string;
}

export default function ExpertPopup({setIsPopupOpen, className}:expertPopupProp){
    const navigate = useNavigate();
    return(
        <div className={`${style[className]}`}>
            <img src={verifyIcon} alt="verify-icon"/>
            <div className={style.title}>전문가 인증이 필요합니다</div>
            <div className={style.description}>
                전문가로 등록하시려면 관련 자격증명이나<br/>
                경력증명서 등의 인증 절차가 필요합니다.<br/>
                인증을 진행하시겠어요?
            </div>
            <div className={style.buttons}>
                <Button
                color="#4d4d4d"
                backgroundColor="#e6e6e6"
                content="취소"
                onClick={() => {setIsPopupOpen(false)}}
                />
                <Button
                color="white"
                backgroundColor="#ff5525"
                content="인증하러가기"
                onClick={() => {navigate("/expert-verify")}}
                />
            </div>
        </div>
    )
}