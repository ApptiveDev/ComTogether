import React from "react"; 
import style from './navButton.module.css'

interface NavButtonProps{
    text: string;
}
export default function NavButton({text}: NavButtonProps){
    return(
        <button className={style.navBtn}>{text}</button>
    )
}