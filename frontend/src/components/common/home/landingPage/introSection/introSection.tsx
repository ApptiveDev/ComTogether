import React from "react";
import style from './introSection.module.css'
import useObserverRef from "../../../../../hooks/useObserverRef";
import {useState} from "react"

export default function IntroSection(){
    const [showIntro, setShowIntro] = useState(false);
    const ref = useObserverRef({ handleObserver: setShowIntro });
    return(
        <div className={style.container}>
            <div ref={ref} className={`${style.content} ${showIntro? style.show:''}`}>
                당신만의 맞춤형 컴퓨터, 더 이상 어렵지 않아요.<br/>
                전문가 1:1 매칭과 쉬운 가이드라인으로,<br/>
                초보자도 안심하고 즐겁게 조립형 PC를 시작할 수 있습니다.
            </div>
        </div>
    )
}