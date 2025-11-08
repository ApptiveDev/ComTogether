// src/utils/performance.ts
import React from 'react';

/**
 * 성능 최적화 관련 유틸리티 함수들
 */

// React.lazy를 위한 지연 로딩 래퍼
export const lazyLoad = (importFunc: () => Promise<{ default: React.ComponentType<unknown> }>) => {
  return React.lazy(() => 
    importFunc().catch(() => ({ 
      default: () => React.createElement('div', {}, '컴포넌트를 로드할 수 없습니다') 
    }))
  );
};

// 디바운스 훅
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 스로틀링 훅
export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = React.useRef<number>(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

// 이미지 지연 로딩을 위한 인터섹션 옵저버 훅
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};

// 메모이제이션된 컴포넌트 생성 헬퍼
export const createMemoComponent = <Props extends object>(
  Component: React.ComponentType<Props>,
  areEqual?: (prevProps: Props, nextProps: Props) => boolean
) => {
  return React.memo(Component, areEqual);
};

// 가상화를 위한 윈도우 사이즈 훅
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};