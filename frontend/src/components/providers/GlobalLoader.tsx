// src/components/providers/GlobalLoader.tsx
import React from "react";
import { useGlobalState } from "../../stores/useGlobalState";
import { LoadingSpinner } from "../ui";
import styles from "./globalLoader.module.css";

export const GlobalLoader: React.FC = () => {
  const { isGlobalLoading, loadingMessage } = useGlobalState();

  if (!isGlobalLoading) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <LoadingSpinner size="large" />
        {loadingMessage && <p className={styles.message}>{loadingMessage}</p>}
      </div>
    </div>
  );
};
