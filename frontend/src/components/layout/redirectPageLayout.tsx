import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner/LoadingSpinner";
import type { RedirectStep } from "../../utils/redirectHelpers";
import { getLoadingText } from "../../utils/redirectHelpers";
import { getStepClass } from "../../utils/redirectHelpers";
import styles from "./redirectPageLayout.module.css";

interface RedirectPageLayoutProps {
  currentStep: RedirectStep;
  authError?: string | null;
  onRetry?: () => void;
}

export default function RedirectPageLayout({
  currentStep,
  authError,
  onRetry,
}: RedirectPageLayoutProps) {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      navigate("/signIn");
    }
  };

  if (authError) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorTitle}>로그인 실패</div>
            <div className={styles.errorMessage}>{authError}</div>
            <button className={styles.retryButton} onClick={handleRetry}>
              다시 시도하기
            </button>
            <div className={styles.redirectMessage}>
              3초 후 로그인 페이지로 이동합니다...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>C</div>

        <div className={styles.title}>로그인 처리 중</div>
        <div className={styles.subtitle}>
          잠시만 기다려주세요.
          <br />
          안전하게 로그인을 진행하고 있습니다.
        </div>

        <div className={styles.progress}>
          <LoadingSpinner
            size="large"
            color="#ff5525"
            text={getLoadingText(currentStep)}
          />
        </div>

        <div className={styles.steps}>
          <div
            className={`${styles.step} ${getStepClass(
              currentStep,
              "authenticating"
            )}`}
          >
            <div className={styles.stepIcon}>1</div>
            <div className={styles.stepLabel}>인증 확인</div>
          </div>
          <div
            className={`${styles.step} ${getStepClass(
              currentStep,
              "fetchingUser"
            )}`}
          >
            <div className={styles.stepIcon}>2</div>
            <div className={styles.stepLabel}>정보 가져오기</div>
          </div>
          <div
            className={`${styles.step} ${getStepClass(
              currentStep,
              "completed"
            )}`}
          >
            <div className={styles.stepIcon}>✓</div>
            <div className={styles.stepLabel}>완료</div>
          </div>
        </div>
      </div>
    </div>
  );
}
