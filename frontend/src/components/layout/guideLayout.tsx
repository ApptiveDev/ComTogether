import style from './guideLayout.module.css';
import Header from '../common/header/header';
import Sidebar from '../common/guide/sidebar/sidebar';
import StepIndicator from '../common/guide/stepIndicator/stepIndicator';
import ContentArea from '../common/guide/contentArea/contentArea';

export default function GuideLayout(){
    return(
        <div className={style.container}>
            <Header />
            <StepIndicator />
            <div className={style.content}>
                <Sidebar />
                <ContentArea />
            </div>
        </div>
    )
}
