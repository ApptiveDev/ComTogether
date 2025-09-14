import style from './contentBlock.module.css'
import {useState} from "react"
import useObserverRef from '../../../../../hooks/useObserverRef';

interface contentProp{
    imageSrc: string;
    headline: string;
    subline: string;
}

export default function ContentBlock({imageSrc,headline,subline}:contentProp){
    const [showHeadline, setShowHeadline] = useState(false);
    const [showSubline, setShowSubline] = useState(false);

    const headRef = useObserverRef({handleObserver:setShowHeadline});
    const subRef = useObserverRef({handleObserver:setShowSubline});

    return(
        <div className={style.container}>
            <div className={style.image}><img src={imageSrc} alt="promo"/></div>
            <div className={style.content}>
                <div ref={headRef} className={`${style.headline} ${showHeadline? style.show:''}`}>
                    {headline.split('\n').map((line,i)=>(
                        <span key={i}>
                            {line}<br/>
                        </span>
                    ))}
                </div>
                <div ref={subRef} className={`${style.subline} ${showSubline? style.show:''}`}>
                    {subline.split('\n').map((line,i)=>(
                        <span key={i}>
                            {line}<br/>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}