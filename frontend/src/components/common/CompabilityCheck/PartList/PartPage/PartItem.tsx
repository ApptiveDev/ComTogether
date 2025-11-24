import styles from './partItem.module.css'

interface partItemProps{
    name: string;
    price: number;
}

export default function partItem({name, price}: partItemProps){
    return(
        <div className={styles.item}>
            <img src="" alt="img"/>
            <div className={styles.name}>{name}</div>
            <div className={styles.priceContainer}>
                <div className={styles.price}>{price.toLocaleString()}원</div>
                <button className={styles.btn}>담기</button>
            </div>
        </div>
    )
}