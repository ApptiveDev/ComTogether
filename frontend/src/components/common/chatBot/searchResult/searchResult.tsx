import React from "react";
import MoreButton from "../moreButton/moreButton";
import { useSearchChatBotStore } from "@/stores/useSearchChatBotStore";
import style from "./searchResult.module.css";

export default function SearchResult() {
  const { result, showMore, setShowMore } = useSearchChatBotStore();
  if (!result) return null;
  const highlight = result.highlight || result.title;
  const title = result.title.replace(
    highlight,
    `<span class='${style.searchResultHighlight}'>${highlight}</span>`
  );
  return (
    <>
      <div className={style.searchResultBox}>
        <div className={style.searchResultTitle}>
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <hr className={style.searchResultHr} />
        <div className={style.searchResultContentWrap}>
          <div className={style.searchResultContent}>
            <div dangerouslySetInnerHTML={{ __html: result.description }} />
          </div>
          <div className={style.searchResultLine} />
        </div>
        <div className={style.searchResultDetailsTitle}>
          {result.detailsTitle}
        </div>
        <MoreButton
          showMore={showMore}
          onClick={() => setShowMore(!showMore)}
        />
      </div>
      {showMore && (
        <div className={style.searchResultScroll}>
          <ul className={style.searchResultDetails}>
            {result.details.map((d, idx) => (
              <li key={idx} className={style.searchResultDetailsItem}>
                <span className={style.searchResultDetailsItemTitle}>
                  {d.title}
                </span>
                {d.desc}
              </li>
            ))}
          </ul>
          <div className={style.searchResultMore}>
            더 많은 정보가 여기에 표시됩니다. (임시 더미)
          </div>
        </div>
      )}
    </>
  );
}
