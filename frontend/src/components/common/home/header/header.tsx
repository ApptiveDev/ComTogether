import React from "react";
import style from './header.module.css'
import NavButton from "../navButton/navButton";
import SettingButton from "../settingButton/settingButton";
import {useState, useEffect} from "react";

export default function Header(){
    const [showHeader, setShowHeader] = useState(false);
    useEffect(()=>{
        setShowHeader(true);
    },[]);

    return(
        <div className={`${style.header} ${showHeader? style.show:''}`}>
            <div className={style.logo}>COM<br/>TOGETHER</div>
            <div className={style.btnContainer}>
                <NavButton text = "가이드 화면"/>
                <NavButton text = "호환성 체크"/>
                <NavButton text = "전문가 상담"/>
                <NavButton text = "커뮤니티"/>
            </div>
            <SettingButton/>
        </div>
    )
}