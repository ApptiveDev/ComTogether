// src/components/optimized/LazyImage.tsx
import React, { useState, useRef } from "react";
import { useIntersectionObserver } from "../../utils/performance";
import styles from "./LazyImage.module.css";

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E',
  className,
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const isInView = useIntersectionObserver(imgRef as React.RefObject<Element>, {
    threshold: 0.1,
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <img
        ref={imgRef}
        src={isInView ? src : placeholder}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${
          isLoaded ? styles.loaded : styles.loading
        }`}
        loading="lazy"
      />
      {!isLoaded && !hasError && isInView && (
        <div className={styles.spinner}>로딩 중...</div>
      )}
      {hasError && (
        <div className={styles.error}>이미지를 불러올 수 없습니다</div>
      )}
    </div>
  );
};
