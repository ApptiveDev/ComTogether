import React from "react";
import Header from "../../common/Header/Header";
import styles from "./baseLayout.module.css";

interface BaseLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string;
  containerClassName?: string;
}

export default function BaseLayout({
  children,
  showHeader = true,
  className = "",
  containerClassName = "",
}: BaseLayoutProps) {
  return (
    <div className={`${styles.layout} ${className}`}>
      {showHeader && <Header />}
      <main
        className={`${styles.main} ${
          showHeader ? styles.withHeader : ""
        } ${containerClassName}`}
      >
        {children}
      </main>
    </div>
  );
}
