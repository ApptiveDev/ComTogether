import { useState } from "react";
import { useDeleteUser } from "../../../api/services/useDeleteUser";
import Modal from "../../ui/Modal/Modal";
import Input from "../../ui/Input/Input";
import Button from "../Button/Button";
import styles from "./DeleteAccountModal.module.css";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const { mutate: deleteUserAccount, isPending: isLoading } = useDeleteUser();

  const CONFIRM_TEXT = "계정삭제";
  const isConfirmValid = confirmText === CONFIRM_TEXT;

  const handleDelete = () => {
    if (isConfirmValid) {
      deleteUserAccount();
      onClose();
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="⚠️ 계정 삭제" size="md">
      <div className={styles.content}>
        <div className={styles.warningSection}>
          <p className={styles.warningTitle}>
            <strong>
              계정을 삭제하면 다음과 같은 데이터가 영구적으로 삭제됩니다:
            </strong>
          </p>
          <ul className={styles.warningList}>
            <li>프로필 정보</li>
            <li>관심사 설정</li>
            <li>포인트 및 활동 기록</li>
            <li>모든 개인 데이터</li>
          </ul>
          <p className={styles.dangerText}>이 작업은 되돌릴 수 없습니다.</p>
        </div>

        <div className={styles.confirmSection}>
          <Input
            label={
              <>
                계속하려면 '
                <span className={styles.confirmText}>{CONFIRM_TEXT}</span>'를
                입력하세요:
              </>
            }
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_TEXT}
            disabled={isLoading}
            error={
              confirmText && !isConfirmValid ? "정확히 입력해주세요" : undefined
            }
          />
        </div>

        <div className={styles.buttonGroup}>
          <Button
            content="취소"
            backgroundColor="var(--color-gray-500)"
            color="white"
            onClick={handleClose}
            disabled={isLoading}
            variant="secondary"
          />

          <Button
            content={isLoading ? "삭제 중..." : "계정 삭제"}
            backgroundColor={
              isConfirmValid ? "var(--color-error)" : "var(--color-gray-300)"
            }
            color="white"
            onClick={handleDelete}
            disabled={!isConfirmValid || isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
