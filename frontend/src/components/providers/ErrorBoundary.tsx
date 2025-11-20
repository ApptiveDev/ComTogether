import React, { Component } from "react";
import type { ReactNode } from "react";
import { ApiError } from "../../api/core/types";
import Modal from "../ui/Modal/Modal";
import Button from "../common/button/Button";
import styles from "./ErrorBoundary.module.css";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });

    // 에러 로깅
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 외부 에러 핸들러 호출
    this.props.onError?.(error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  private getErrorMessage(error: Error): string {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 400:
          return "잘못된 요청입니다. 입력 정보를 확인해주세요.";
        case 401:
          return "인증이 필요합니다. 다시 로그인해주세요.";
        case 403:
          return "접근 권한이 없습니다.";
        case 404:
          return "요청한 페이지를 찾을 수 없습니다.";
        case 500:
          return "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        default:
          return error.message || "알 수 없는 오류가 발생했습니다.";
      }
    }

    return error.message || "예기치 못한 오류가 발생했습니다.";
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { error } = this.state;

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.title}>문제가 발생했습니다</h2>
            <p className={styles.message}>
              {error
                ? this.getErrorMessage(error)
                : "알 수 없는 오류가 발생했습니다."}
            </p>

            <div className={styles.actions}>
              <Button
                content="페이지 새로고침"
                backgroundColor="var(--color-primary-600)"
                color="white"
                onClick={this.handleReload}
              />
              <Button
                content="다시 시도"
                backgroundColor="var(--color-gray-500)"
                color="white"
                onClick={this.handleReset}
              />
            </div>

            {process.env.NODE_ENV === "development" && error && (
              <div className={styles.devSection}>
                <button
                  className={styles.detailsToggle}
                  onClick={this.toggleDetails}
                >
                  {this.state.showDetails
                    ? "상세 정보 숨기기"
                    : "상세 정보 보기"}
                </button>

                {this.state.showDetails && (
                  <div className={styles.errorDetails}>
                    <h4>Error Details (Development Mode)</h4>
                    <pre className={styles.stackTrace}>{error.stack}</pre>
                    {this.state.errorInfo && (
                      <pre className={styles.stackTrace}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// API 에러 전용 바운더리
interface ApiErrorBoundaryProps {
  children: ReactNode;
}

interface ApiErrorBoundaryState {
  error: ApiError | null;
}

export class ApiErrorBoundary extends Component<
  ApiErrorBoundaryProps,
  ApiErrorBoundaryState
> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ApiErrorBoundaryState> {
    if (error instanceof ApiError) {
      return { error };
    }
    return {};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (error instanceof ApiError) {
      console.error("API Error caught:", error, errorInfo);
    }
  }

  private handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <Modal
          isOpen={true}
          onClose={this.handleRetry}
          title="API 오류"
          size="md"
        >
          <div className={styles.apiErrorContent}>
            <p>{this.state.error.message}</p>
            <div className={styles.apiErrorActions}>
              <Button
                content="다시 시도"
                backgroundColor="var(--color-primary-600)"
                color="white"
                onClick={this.handleRetry}
              />
            </div>
          </div>
        </Modal>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
