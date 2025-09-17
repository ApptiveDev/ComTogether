import style from './signIntLayout.module.css'
import BrandSection from '../common/signIn/brandSection/brandSection'
import AuthSection from '../common/signIn/authSection/authSection'

export default function SignInLayout(){
    return(
        <div className={style.container}>
            <BrandSection/>
            <AuthSection/>
        </div>
    )
}