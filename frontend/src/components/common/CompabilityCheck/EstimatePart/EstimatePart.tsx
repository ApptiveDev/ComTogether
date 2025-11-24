import EstimateHeader from "./EstimateHeader/EstimateHeader"
import EstimateButton from "./EstimateButton/EstimateButton";
import SelectedPartList from "./SelectedPartList/SelectedPartList"
import styles from './estimatePart.module.css'

export default function EstimatePart(){
    return(
        <div className={styles.container}>
            <EstimateHeader
            />
            <SelectedPartList/>
            <div className={styles.btnContainer}>
                <EstimateButton
                content="호환성 체크"
                variant="primary"
                size="lg"
                />
                <EstimateButton
                content="저장"
                variant="outline"
                size="lg"
                />
            </div>
        </div>
    )
}