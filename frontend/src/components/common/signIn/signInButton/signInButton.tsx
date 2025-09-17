import style from './signInButton.module.css'
import kakao from '@/assets/image/kakao.svg'

export default function SignInButton(){
    return(
        <button className={style.signInBtn}>
            <img src={kakao} alt="kakao"/>
            <span>카카오로 시작하기</span>
        </button>
    )
}