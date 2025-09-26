import style from "./chatBot.module.css";
import { useSearchChatBotStore } from "@/stores/useSearchChatBotStore";
import RecentSearchItem from "./recentSearchItem";
import SearchResult from "./searchResult/searchResult";

export default function ChatBot() {
  const { result, resultNotFound, recentSearches } =
    useSearchChatBotStore.useMultiple((state) => ({
      result: state.result,
      resultNotFound: state.resultNotFound,
      recentSearches: state.recentSearches,
    }));

  const clearRecentSearches = useSearchChatBotStore.useClearRecentSearches();

  return (
    <div className={style.chatBot}>
      {/* 검색 결과가 있는 경우 */}
      {result && <SearchResult />}

      {/* 검색 결과가 없는 경우 */}
      {resultNotFound && (
        <div className={style.noResult}>
          <p>검색 결과가 없습니다.</p>
          <p>다른 키워드로 검색해보세요.</p>
        </div>
      )}

      {/* 최근 검색어 */}
      {!result && !resultNotFound && recentSearches.length > 0 && (
        <div className={style.recentSearches}>
          <div className={style.recentHeader}>
            <span>최근 검색어</span>
            <button onClick={clearRecentSearches}>전체 삭제</button>
          </div>
          <div className={style.recentList}>
            {recentSearches.map((keyword) => (
              <RecentSearchItem key={keyword} keyword={keyword} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
