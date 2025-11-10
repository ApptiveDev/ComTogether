import React from "react";
import BaseLayout from "./BaseLayout";
import styles from "./BaseLayout.module.css";

interface CenteredLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  description?: string;
}

export default function CenteredLayout({
  children,
  showHeader = true,
  title,
  description,
}: CenteredLayoutProps) {
  return (
    <BaseLayout
      showHeader={showHeader}
      containerClassName={`${styles.centered} ${styles.verticalSpacing}`}
    >
      {title && (
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      {children}
    </BaseLayout>
  );
}
