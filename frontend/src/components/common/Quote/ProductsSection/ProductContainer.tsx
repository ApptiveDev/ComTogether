import styles from "./productContainer.module.css";
import PartPage from "./Products/ProductList";
import SearchBar from "./SearchBar/SearchBar";
import Pagination from "./Pagination/Pagination";
import { useGetProducts, useGetRecommendedProducts } from "@/api/Product";
import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/types/product";

interface PartListProps {
  currentCategory: string;
}

export default function ProductContainer({ currentCategory }: PartListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [useRecommendedFilter, setUseRecommendedFilter] = useState(false); // 관심사 기반 필터 토글
  const itemsPerPage = 5;

  // 카테고리 변경 시 검색어 초기화 및 페이지 리셋
  useEffect(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, [currentCategory]);

  const shouldUseRecommended = !searchQuery || useRecommendedFilter;

  const {
    data: normalData,
    isLoading: isNormalLoading,
    isError: isNormalError,
  } = useGetProducts(
    {
      category: currentCategory,
      query: searchQuery,
      display: 50,
      start: 1,
      sort: "sim",
    },
    {
      enabled: !!searchQuery && !useRecommendedFilter, // 검색어 있고 토글 OFF일 때만
    }
  );

  // 추천 제품 데이터 가져오기 (검색어 없거나, 검색어 있고 토글 ON)
  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = useGetRecommendedProducts(
    {
      category: currentCategory,
      query: searchQuery || currentCategory, // 검색어 없으면 카테고리명으로 추천
      display: 50,
      start: 1,
      sort: "sim",
    },
    {
      enabled: shouldUseRecommended, // 검색어 없거나 토글 ON
    }
  );

  // 현재 모드에 따라 데이터 선택
  const data = shouldUseRecommended ? recommendedData : normalData;
  const isLoading = shouldUseRecommended
    ? isRecommendedLoading
    : isNormalLoading;
  const isError = shouldUseRecommended ? isRecommendedError : isNormalError;

  // Product[] 배열로 사용
  const allItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items;
  }, [data]);

  // 페이지네이션 (API에서 이미 필터링된 데이터이므로 추가 필터링 불필요)
  const totalSearchItems = allItems.length;
  const totalSearchPages = Math.ceil(totalSearchItems / itemsPerPage);

  const pageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allItems.slice(startIndex, endIndex);
  }, [allItems, currentPage, itemsPerPage]);

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          {shouldUseRecommended ? "추천 제품을" : "제품을"} 불러오는 중...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>제품을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.category}>{currentCategory}</div>
        <div className={styles.metabox}>
          <div className={styles.totalItem}>총 {totalSearchItems}건</div>
          <SearchBar setSearchResult={handleSearch} />
        </div>
      </div>

      {/* 토글 항상 표시 */}
      <div className={styles.filterToggle}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={useRecommendedFilter}
            onChange={(e) => {
              setUseRecommendedFilter(e.target.checked);
              setCurrentPage(1);
            }}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSwitch}></span>
          <span className={styles.toggleText}>
            관심사 기반 추천 필터
            {!searchQuery && (
              <span className={styles.disabledNote}> (검색 시 사용 가능)</span>
            )}
          </span>
        </label>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.colImage}></div>
          <div className={styles.colName}>제품명</div>
          <div className={styles.colPrice}>판매가격</div>
        </div>
        <PartPage pageItems={pageItems} category={currentCategory} />
      </div>
      <Pagination
        totalPages={totalSearchPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
