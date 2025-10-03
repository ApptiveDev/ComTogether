import style from './customInterest.module.css';
import confirmBtn from '@/assets/image/confirm.svg';
import cancelBtn from '@/assets/image/cancel.svg';

interface CustomInterestProps {
    value: string;
    onChange: (value: string) => void;
    handleConfirm: () => void;
    handleCancel: () => void;
}

export default function CustomInterest({ value, onChange, handleConfirm, handleCancel }: CustomInterestProps) {
    return (
        <div className={style.interestContent}>
            <div className={style.inputContainer}>
                <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="관심사를 입력하세요" className={style.addInterestInput} />
            </div>
            <div className={style.btnContainer}>
                <button className={style.confirmBtn} onClick={handleConfirm}>
                    <img src={confirmBtn} alt="confirm" />
                </button>
                <button className={style.cancelBtn} onClick={handleCancel}>
                    <img src={cancelBtn} alt="cancel" />
                </button>
            </div>
        </div>   
    )
}
                                     