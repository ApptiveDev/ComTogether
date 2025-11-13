import style from "./customInterest.module.css";
import confirmBtn from "@/assets/image/confirm.svg";
import cancelBtn from "@/assets/image/cancel.svg";

interface CustomInterestProps {
  value: string;
  onChange: (value: string) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export default function CustomInterest({
  value,
  onChange,
  handleConfirm,
  handleCancel,
}: CustomInterestProps) {
  return (
    <div className={style.interestContent}>
      <div className={style.inputContainer}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="관심사를 입력하세요"
          className={style.addInterestInput}
        />
      </div>
      <div className={style.btnContainer}>
        <div
          className={style.confirmBtn}
          onClick={handleConfirm}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        >
          <img src={confirmBtn} alt="confirm" />
        </div>
        <div
          className={style.cancelBtn}
          onClick={handleCancel}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleCancel()}
        >
          <img src={cancelBtn} alt="cancel" />
        </div>
      </div>
    </div>
  );
}
