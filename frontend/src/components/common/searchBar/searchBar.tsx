import { useState, useEffect, useRef } from "react";
import RecentSearchItem from "../glossary/RecentSearchItem";
import { useSearchGlossaryStore } from "../../../stores/useSearchGlossaryStore";
import { useGlossaryAutoComplete } from "@/api/glossary/useGlossaryAutoComplete";
import Button from "../Button/Button";
import style from "./searchBar.module.css";
import clock_icon from "../../../assets/image/icon/clock_icon.svg";
import { useShallow } from "zustand/shallow";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar() {
  const {
    recentSearches,
    handleRemoveRecent,
    setSelectedGlossaryId,
    addRecentSearch,
    setHasSearched,
  } = useSearchGlossaryStore(
    useShallow((state) => ({
      recentSearches: state.recentSearches,
      handleRemoveRecent: state.handleRemoveRecent,
      setSelectedGlossaryId: state.setSelectedGlossaryId,
      addRecentSearch: state.addRecentSearch,
      setHasSearched: state.setHasSearched,
    }))
  );

  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce된 입력값 (300ms 지연)
  const debouncedInputValue = useDebounce(inputValue, 300);

  // 자동완성 데이터 가져오기 (debounced value 사용)
  const { data: suggestionsRaw, isLoading } =
    useGlossaryAutoComplete(debouncedInputValue);

  // string 배열을 {id, term} 객체 배열로 변환
  const suggestions =
    suggestionsRaw?.map((term, index) => ({
      id: index,
      term: term,
    })) || [];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const trimmedSearch = inputValue.trim();
    if (!trimmedSearch) return;

    setHasSearched(true);

    // 자동완성 결과에서 매칭되는 항목 찾기
    const matchedSuggestion = suggestions?.find(
      (item) => item.term.toLowerCase() === trimmedSearch.toLowerCase()
    );

    if (matchedSuggestion) {
      setSelectedGlossaryId(matchedSuggestion.term); // term(용어명)을 저장
      addRecentSearch(matchedSuggestion.term);
    } else {
      // 매칭되는 항목이 없으면 입력값 그대로 검색
      setSelectedGlossaryId(trimmedSearch);
      addRecentSearch(trimmedSearch);
    }

    setInputValue("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (_id: number, term: string) => {
    setSelectedGlossaryId(term); // term(용어명)을 저장
    addRecentSearch(term);
    setInputValue("");
    setShowSuggestions(false);
    setHasSearched(true);
    setSelectedIndex(-1);
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || !suggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selected = suggestions[selectedIndex];
          handleSuggestionClick(selected.id, selected.term);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={style.searchBar}>
      <form
        className={style.searchForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className={style.searchInputWrapper}>
          <div className={style.searchIcon}>
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            className={style.searchInput}
            type="text"
            placeholder="검색어를 입력하세요"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {showSuggestions && inputValue.length > 0 && (
            <div className={style.suggestionsDropdown} ref={suggestionsRef}>
              {isLoading ? (
                <div className={style.suggestionItem}>
                  <span className={style.loadingText}>검색 중...</span>
                </div>
              ) : suggestions && suggestions.length > 0 ? (
                suggestions.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className={`${style.suggestionItem} ${
                      index === selectedIndex ? style.suggestionItemActive : ""
                    }`}
                    onClick={() => handleSuggestionClick(item.id, item.term)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {item.term}
                  </div>
                ))
              ) : (
                <div className={style.suggestionItem}>
                  <span className={style.noResultText}>
                    검색 결과가 없습니다
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <Button
          content="검색"
          onClick={handleSearch}
          backgroundColor="#FF5525"
          color="#ffffff"
          size="md"
        />
      </form>
      {recentSearches.length > 0 && (
        <div className={style.recentSearches}>
          <span className={style.recentSearchLabel}>
            최근 검색어
            <span className={style.recentSearchClock}>
              <img src={clock_icon} alt="Clock" />
            </span>
          </span>
          {recentSearches.map((item) => (
            <RecentSearchItem
              key={item}
              keyword={item}
              onRemove={handleRemoveRecent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
