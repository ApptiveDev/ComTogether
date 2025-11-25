import style from './skillLevelCard.module.css'
import shadow from '@/assets/image/shadow.svg'

interface cardProps{
    level:string;
    description:string;
    image:string;
    onClick: ()=>void;
    check: boolean
}

export default function SkillLevelCard({level, description, image, onClick, check}:cardProps){
    return(
        <div className={style.container} onClick={onClick}>
            <div className={`${style.card} ${check? style.check:''}`}>
                <div className={style.level}>{level}</div>
                <div className={style.description}>
                    {description.split('\n').map((line,index)=>(
                        <span key={index}>{line}<br/></span>
                    ))}
                </div>
            </div>
            <div className={`${style.image} ${check? style.check:''}`}>
                <img className={style.levelImg} src={image} alt={level}/>
                <img className={`${style.shadowImg} ${check? style.check:''}`} src={shadow} alt="shadow"/>
            </div>
        </div>
    )
}