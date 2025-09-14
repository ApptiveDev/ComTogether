import style from './bannerSection.module.css'
import useObserverRef from '../../../../../hooks/useObserverRef'
import {useState} from "react"

export default function BannerSection(){
    const [showBanner, setShowBanner] = useState(false);
    const ref = useObserverRef({handleObserver:setShowBanner});

    return(
        <div className={style.container}>
            <div ref={ref} className={`${style.content} ${showBanner? style.show:''}`}>조립형 PC 더 이상 어렵지 않아요</div>
        </div>
    )
}