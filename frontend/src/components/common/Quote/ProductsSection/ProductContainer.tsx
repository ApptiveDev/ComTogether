import styles from "./productContainer.module.css";
import PartPage from "./Products/ProductList";
import SearchBar from "./SearchBar/SearchBar";
import Pagination from "./Pagination/Pagination";
import { useGetProducts, useGetRecommendedProducts } from "@/api/Product";
import { useState, useMemo, useEffect } from "react";
import type { item } from "@/types/compatibility";
import type { Product } from "@/types/product";

// Product 타입을 item 타입으로 변환
const convertProductToItem = (product: Product): item => ({
  id: parseInt(product.product_id) || 0,
  name: product.title,
  price: parseInt(product.lprice) || 0,
  image: product.image,
});

export default function PartList() {
  const [currentCategory] = useState("CPU");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommended, setShowRecommended] = useState(false);
  const itemsPerPage = 5;

  // 일반 제품 데이터 가져오기
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
      enabled: !showRecommended, // 추천 모드가 아닐 때만 실행
    }
  );

  // 추천 제품 데이터 가져오기
  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = useGetRecommendedProducts(
    {
      category: currentCategory,
      query: searchQuery,
      display: 50,
      start: 1,
      sort: "sim",
    },
    {
      enabled: showRecommended, // 추천 모드일 때만 실행
    }
  );

  // 리렌더링 시 추천 제품 자동 로드
  useEffect(() => {
    setShowRecommended(true);
  }, []);

  // 현재 모드에 따라 데이터 선택
  const data = showRecommended ? recommendedData : normalData;
  const isLoading = showRecommended ? isRecommendedLoading : isNormalLoading;
  const isError = showRecommended ? isRecommendedError : isNormalError;

  // Product[] -> item[] 변환
  const allItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map(convertProductToItem);
  }, [data]);

  // 검색 결과 필터링
  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    return allItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allItems, searchQuery]);

  // 페이지네이션
  const totalSearchItems = filteredItems.length;
  const totalSearchPages = Math.ceil(totalSearchItems / itemsPerPage);

  const pageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          {showRecommended ? "추천 제품을" : "제품을"} 불러오는 중...
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
        <div className={styles.category}>
          {currentCategory}
          {showRecommended && <span className={styles.badge}> (추천)</span>}
        </div>
        <div className={styles.metabox}>
          <div className={styles.totalItem}>총 {totalSearchItems}건</div>
          <SearchBar setSearchResult={handleSearch} categoryItem={allItems} />
        </div>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.colImage}></div>
          <div className={styles.colName}>제품명</div>
          <div className={styles.colPrice}>판매가격</div>
        </div>
        <PartPage pageItems={pageItems} />
      </div>
      <Pagination
        totalPages={totalSearchPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
