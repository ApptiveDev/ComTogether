import NoSearchResult from "../noSearchResult/NoSearchResult";
import { useSearchGlossaryStore } from "../../../../stores/useSearchGlossaryStore";
import { useGlossaryDetail } from "@/api/glossary/useGlossaryDetail";
import style from "./searchResult.module.css";
import ReactMarkdown from "react-markdown";

export default function SearchResult() {
  const { selectedGlossaryId, hasSearched } = useSearchGlossaryStore();

  // 용어 상세 정보 가져오기
  const { data: glossaryDetail, isLoading } =
    useGlossaryDetail(selectedGlossaryId);

  // 검색을 했지만 결과가 없는 경우
  if (hasSearched && !selectedGlossaryId) {
    return <NoSearchResult message="검색 결과가 없습니다." />;
  }

  // 로딩 중
  if (isLoading) {
    return <div className={style.searchResultBox}>로딩 중...</div>;
  }

  // 검색 결과가 있는 경우에만 표시
  if (!glossaryDetail) return null;

  return (
    <>
      <div className={style.searchResultBox}>
        <div className={style.searchResultTitle}>
          <span className={style.searchResultHighlight}>
            {glossaryDetail.name}
          </span>
        </div>
        <hr className={style.searchResultHr} />
        <div className={style.searchResultContentWrap}>
          <div className={style.searchResultContent}>
            <ReactMarkdown>{glossaryDetail.description}</ReactMarkdown>
          </div>
          <div className={style.searchResultLine} />
        </div>
        {/* 더보기 기능은 추후 백엔드에서 추가 정보를 제공할 때 활성화 */}
        {/* <div className={style.searchResultDetailsTitle}>
          <ReactMarkdown>상세 정보</ReactMarkdown>
        </div>
        <MoreButton
          showMore={showMore}
          onClick={() => setShowMore(!showMore)}
        /> */}
      </div>
      {/* 상세 정보는 추후 백엔드 API에서 제공될 때 활성화 */}
      {/* {showMore && (
        <div className={style.searchResultScroll}>
          <div className={style.searchResultMore}>
            <ReactMarkdown>
              더 많은 정보가 여기에 표시됩니다.
            </ReactMarkdown>
          </div>
        </div>
      )} */}
    </>
  );
}
