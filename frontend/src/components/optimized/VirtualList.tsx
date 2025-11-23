// src/components/optimized/VirtualList.tsx
import React, { useMemo, useState } from "react";
import { useWindowSize } from "../../utils/performance";
import styles from "./virtualList.module.css";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
}: VirtualListProps<T>): React.ReactElement => {
  const [scrollTop, setScrollTop] = useState(0);
  const { height: windowHeight } = useWindowSize();

  const visibleRange = useMemo(() => {
    const effectiveHeight = Math.min(containerHeight, windowHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(effectiveHeight / itemHeight) + 1,
      items.length
    );

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, windowHeight, items.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      className={`${styles.container} ${className || ""}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {items
            .slice(visibleRange.start, visibleRange.end)
            .map((item, index) => (
              <div
                key={visibleRange.start + index}
                style={{ height: itemHeight }}
                className={styles.item}
              >
                {renderItem(item, visibleRange.start + index)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
