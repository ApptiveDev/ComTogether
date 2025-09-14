import style from './section.module.css'
import {useState} from "react"
import useObserverRef from '../../../../../hooks/useObserverRef'

interface sectionProp{
    title:string;
    description:string;
    subtext:string;
    imageSrc:string;
    color:string;
}

export default function Section({title, description,subtext,imageSrc,color}: sectionProp){
    const [showMain, setShowMain] = useState(false);
    const [showSub, setShowSub] = useState(false);

    const mainRef = useObserverRef({ handleObserver: setShowMain });
    const subRef = useObserverRef({handleObserver: setShowSub});

    return(
        <div className={style.container} style={{backgroundColor:`${color}`}}>
            <div className={style.mainContent}>
                <div ref={mainRef} className={`${style.mainText} ${showMain? style.show:''}`}>
                    <div className={style.section}>{title}</div>
                    <div className={style.description}>
                        {description.split('\n').map((line, i) => (
                            <span key={i}>
                                {line}
                                <br/>
                            </span>
                        ))}
                    </div>
                </div>
                <img src={imageSrc} className={style.image} alt="image"/>
            </div>
            <div ref={subRef} className={`${style.subText} ${showSub? style.show:''}`}>
                {subtext.split('\n').map((line, i) => (
                    <span key={i}>
                        {line}
                        <br/>
                    </span>
                ))}
            </div>
        </div>
    )
}