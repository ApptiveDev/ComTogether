import CenteredLayout from "./base/CenteredLayout";
import InstructionBox from "../common/ExpertVerify/InstructionBox/InstructionBox";
import FileUploadBox from "../common/ExpertVerify/FileUploadBox/FileUploadBox";
import styles from "./expertVerifyLayout.module.css";
import { useLogout } from "@/api/services/useLogout";
import {
  useCertificationGet,
  useCertificationDelete,
} from "@/api/Certification";
import { useNavigate } from "react-router";
import Button from "../common/Button/Button";
import { useProfileSetupStore } from "@/stores/useProfileSetupStore";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ExpertVerifyLayout() {
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const { data: certifications, isLoading } = useCertificationGet();
  const { mutate: deleteCertification } = useCertificationDelete();
  const { setCurrentStep, tempRole } = useProfileSetupStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // tempRole이 EXPERT가 아니면 Setting 페이지로 리다이렉트
    if (tempRole !== "EXPERT") {
      navigate("/setting");
      return;
    }

    // 페이지 진입 시 현재 단계 저장
    setCurrentStep("expert-verify");
  }, [tempRole, setCurrentStep, navigate]);
  const instructionItems = [
    "컴퓨터공학 관련 학위증명서",
    "IT 관련 자격증 (정보처리기사, 컴활 등)",
    "PC 조립/수리 관련 경력증명서",
    "IT 기업 재직증명서",
    "관련 업종 사업자등록증",
  ];

  // 최신 인증 상태 확인
  const latestCertification = certifications?.[0];

  const handleLogout = () => {
    logout();
  };

  const handleRetry = () => {
    // 거절된 인증서 삭제 후 페이지 새로고침
    if (latestCertification?.cert_id) {
      deleteCertification(latestCertification.cert_id, {
        onSuccess: () => {
          window.location.reload();
        },
        onError: () => {
          // 삭제 실패해도 새로고침하여 UI 갱신
          window.location.reload();
        },
      });
    } else {
      window.location.reload();
    }
  };

  const handleNext = () => {
    setCurrentStep("interest-selection");
    navigate("/second-setting");
  };

  return (
    <CenteredLayout
      title="전문가 인증"
      description="전문가임을 인증할 수 있는 다음 중 하나의 문서를 첨부해주세요."
    >
<<<<<<< HEAD
      <button onClick={handleLogout} className={styles.logoutBtn}>
        로그아웃
      </button>

=======
      <div className={styles.userInfo}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          로그아웃
        </button>
        {user?.email && <span className={styles.userEmail}>{user.email}</span>}
      </div>
>>>>>>> yuhoyeong/frontend/setting-page-renual
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>인증 상태를 확인하는 중...</p>
        </div>
      ) : latestCertification?.status === "APPROVED" ? (
        <div className={styles.statusContainer}>
          <div className={styles.approvedBox}>
            <h3>✅ 인증 승인됨</h3>
            <p>전문가 인증이 승인되었습니다!</p>
            <p className={styles.statusSubtext}>
              다음 단계로 이동하여 프로필 설정을 완료해주세요.
            </p>
            <Button
              color="white"
              backgroundColor="#34c759"
              content="다음 단계로"
              onClick={handleNext}
            />
          </div>
        </div>
      ) : latestCertification?.status === "PENDING" ? (
        <div className={styles.statusContainer}>
          <div className={styles.pendingBox}>
            <h3>🕐 승인 대기 중</h3>
            <p>전문가 인증 요청이 검토 중입니다.</p>
            <p className={styles.statusSubtext}>
              관리자 승인 후 전문가 권한이 부여됩니다.
            </p>
            <Button
              color="white"
              backgroundColor="#ff9500"
              content="취소하고 다시 제출하기"
              onClick={handleRetry}
            />
          </div>
        </div>
      ) : latestCertification?.status === "REJECTED" ? (
        <div className={styles.statusContainer}>
          <div className={styles.rejectedBox}>
            <h3>❌ 인증 거절됨</h3>
            <p>전문가 인증이 거절되었습니다.</p>
            {latestCertification.reason && (
              <div className={styles.reasonBox}>
                <strong>거절 사유:</strong>
                <p>{latestCertification.reason}</p>
              </div>
            )}
            <p className={styles.statusSubtext}>
              다른 인증 문서를 제출해주세요.
            </p>
            <Button
              color="white"
              backgroundColor="#ff5525"
              content="다시 제출하기"
              onClick={handleRetry}
            />
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <InstructionBox items={instructionItems} />
          <FileUploadBox />
        </div>
      )}
    </CenteredLayout>
  );
}
