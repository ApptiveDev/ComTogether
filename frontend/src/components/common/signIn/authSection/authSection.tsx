import style from './authSection.module.css'
import SignInButton from '../signInButton/signInButton'

export default function AuthSection(){
    return(
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.logo}>COM<br/>TOGETHER</div>
                <SignInButton/>
            </div>
            <div className={style.copyright}>&copy; 2025 COMTOGETHER. All Rights Reserved.</div>
        </div>
    )
}