import RecentSearchItem from "../chatBot/recentSearchItem";
import { useSearchChatBotStore } from "../../../stores/useSearchChatBotStore";
import Button from "../Button/button";
import style from "./searchBar.module.css";
import clock_icon from "../../../assets/image/icon/clock_icon.svg";
import { useShallow } from "zustand/shallow";

export default function SearchBar() {
  const {
    search,
    setSearch,
    recentSearches,
    handleSearch,
    handleRemoveRecent,
  } = useSearchChatBotStore(
    useShallow((state) => ({
      search: state.search,
      setSearch: state.setSearch,
      recentSearches: state.recentSearches,
      handleSearch: state.handleSearch,
      handleRemoveRecent: state.handleRemoveRecent,
    }))
  );

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
            className={style.searchInput}
            type="text"
            placeholder="검색어를 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
