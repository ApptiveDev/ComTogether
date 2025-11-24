import styles from './EstimateHeader.module.css'
import EstimateButton from '../estimateButton/EstimateButton'
import { useState, useRef } from "react";
import EstimateHistoryModal from '../EstimateHistoryModal/EstimateHistoryModal';

export default function EstimateHeader(){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mockHistories = [
        { id: 1, title: "견적이름", date: "2025-11-18" },
        { id: 2, title: "게임용 PC", date: "2025-11-19" },
        { id: 3, title: "사무용 PC", date: "2025-11-20" },
    ];

    const handleSelectEstimate = (id: number) => {
        console.log("선택된 견적 ID:", id);
    };

    const modalRef = useRef<HTMLDivElement>(null);

    return(
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.totalPrice}>총: 300,000원</div>
                <div className={styles.btnContainer}>
                    <EstimateButton
                    content='이전 견적'
                    variant='outline'
                    size='md'
                    onClick={() => setIsModalOpen(true)}               
                    />
                </div>
            </div>
            <div className={styles.modalWrapper} ref={modalRef}>
                <EstimateHistoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    histories={mockHistories}
                    onSelect={handleSelectEstimate}
                    container={modalRef}
                />
            </div>
        </div>
    )
}