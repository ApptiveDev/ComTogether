import React from "react";
import style from './heroSection.module.css'
import logo from '@/assets/image/logo.svg'
import scrollIcon from '@/assets/image/Scroll.svg'
import {useState, useEffect} from "react"

export default function HeroSection(){
    const [showLogo, setShowLogo] = useState(false);
    const [showSlogan, setShowSlogan] =useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [showDots, setShowDots] = useState(false);

    const dots:string[] = [".", ".", "."];

    useEffect(()=>{
        setTimeout(()=>setShowLogo(true),300);
        setTimeout(()=>setShowSlogan(true),900);
        setTimeout(()=>setShowDots(true),1300);
        setTimeout(()=>setShowBrand(true),1900);
    },[]);

    return(
        <div className={style.container}>
            <img className={`${style.logo} ${showLogo? style.show:''}`} src={logo} alt="logo"/>
            <img className={style.scrollIcon} src={scrollIcon} alt="scroll-icon"/>
            <div className={style.content}>
                <div className={style.dots}>
                    {dots.map((dot, index)=>(
                        <span
                        key={index}
                        className={`${style.dot} ${showDots? style.show:''}`}
                        style={{transitionDelay: `${index*0.2}s`}}
                        >{dot}</span>
                    ))}
                </div>
                <span className={`${style.slogan} ${showSlogan? style.show:''}`}>세상에 컴알못이 사라질 때까지!</span>
                <span className={`${style.brand} ${showBrand? style.show:''}`}>컴투게더</span>
            </div>
        </div>
    )
}