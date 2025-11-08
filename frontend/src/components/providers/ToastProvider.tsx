// src/components/providers/ToastProvider.tsx
import React from "react";
import { useGlobalState } from "../../stores/useGlobalState";
import styles from "./ToastProvider.module.css";

interface ToastItemProps {
  toast: {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
  };
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const handleClose = () => {
    onRemove(toast.id);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "";
    }
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{toast.message}</span>
      </div>
      <button className={styles.closeButton} onClick={handleClose}>
        ✕
      </button>
    </div>
  );
};

export const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useGlobalState();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
