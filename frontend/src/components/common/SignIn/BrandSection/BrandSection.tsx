import style from './brandSection.module.css'
import logo from '@/assets/image/logo.svg'

export default function BrandSection(){
    return(
        <div className={style.container}>
            <img src={logo} alt="logo"/>
        </div>
    )
}