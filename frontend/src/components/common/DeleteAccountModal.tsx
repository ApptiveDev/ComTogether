import { useState } from 'react';
import { useDeleteUser } from '../../api/userSetting/useDeleteUser';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const { deleteUserAccount, isLoading } = useDeleteUser();
  
  const CONFIRM_TEXT = '계정삭제';
  const isConfirmValid = confirmText === CONFIRM_TEXT;

  const handleDelete = () => {
    if (isConfirmValid) {
      deleteUserAccount();
      onClose(); // 모달 닫기
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px', textAlign: 'center' }}>
          ⚠️ 계정 삭제
        </h2>
        
        <div style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '15px' }}>
            <strong>계정을 삭제하면 다음과 같은 데이터가 영구적으로 삭제됩니다:</strong>
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
            <li>프로필 정보</li>
            <li>관심사 설정</li>
            <li>포인트 및 활동 기록</li>
            <li>모든 개인 데이터</li>
          </ul>
          <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            계속하려면 '<span style={{ color: '#dc3545' }}>{CONFIRM_TEXT}</span>'를 입력하세요:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_TEXT}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              borderColor: isConfirmValid ? '#28a745' : '#ddd'
            }}
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            취소
          </button>
          
          <button
            onClick={handleDelete}
            disabled={!isConfirmValid || isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: isConfirmValid ? '#dc3545' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: (!isConfirmValid || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (!isConfirmValid || isLoading) ? 0.6 : 1
            }}
          >
            {isLoading ? '삭제 중...' : '계정 삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}