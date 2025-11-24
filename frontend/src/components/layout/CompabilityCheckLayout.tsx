import styles from './compabilityCheckLayout.module.css'
import Header from '../common/header/Header'
import CategorySelector from '../common/CompabilityCheck/CategorySelector/CategorySelector'
import PartList from '../common/CompabilityCheck/PartList/PartList'
import EstimatePart from '../common/CompabilityCheck/EstimatePart/EstimatePart'

export default function CompatibilityCheckLayout(){
    return(
        <div className={styles.container}>
            <Header/>
            <CategorySelector/> 
            <div className={styles.content}> 
                <PartList/>
                <EstimatePart/>
            </div>
        </div>
    )
}