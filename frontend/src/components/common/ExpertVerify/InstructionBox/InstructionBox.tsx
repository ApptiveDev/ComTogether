import style from './instructionBox.module.css'

interface instructionBoxProp{
    items: string[];
}

export default function InstructionBox({items}:instructionBoxProp){
    return(
        <div className={style.boxContainer}>
            <div className={style.boxTitle}>인증 가능한 문서</div>
            <ul className={style.boxList}>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}