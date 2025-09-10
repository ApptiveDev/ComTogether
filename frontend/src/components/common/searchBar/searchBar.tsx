import React from "react";
import RecentSearchItem from "../chatBot/recentSearchItem";
import { useSearchChatBotStore } from "../../../stores/useSearchChatBotStore";
import style from "./SearchBar.module.css";
import clock_icon from "../../../assets/image/clock.svg";

export default function SearchBar() {
  const {
    search,
    setSearch,
    recentSearches,
    handleSearch,
    handleRemoveRecent,
  } = useSearchChatBotStore();

  return (
    <div className={style.searchBar}>
      <form
        className={style.searchInputWrapper}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          className={style.searchInput}
          type="text"
          placeholder={"검색어를 입력하세요"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button className={style.searchBtn} onClick={handleSearch}>
          검색
        </button>
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
