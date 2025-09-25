import React from "react";
import MoreButton from "../moreButton/moreButton";
import { useSearchChatBotStore } from "@/stores/useSearchChatBotStore";
import style from "./searchResult.module.css";
import ReactMarkdown from "react-markdown";

export default function SearchResult() {
  const { result, showMore, setShowMore } = useSearchChatBotStore();

  if (!result) return null;

  const highlight = result.highlight || result.title;
  const titleWithHighlight = result.title.replace(
    highlight,
    `**${highlight}**`
  );

  return (
    <>
      <div className={style.searchResultBox}>
        <div className={style.searchResultTitle}>
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <span className={style.searchResultHighlight}>{children}</span>
              ),
            }}
          >
            {titleWithHighlight}
          </ReactMarkdown>
        </div>
        <hr className={style.searchResultHr} />
        <div className={style.searchResultContentWrap}>
          <div className={style.searchResultContent}>
            <ReactMarkdown>{result.description}</ReactMarkdown>
          </div>
          <div className={style.searchResultLine} />
        </div>
        <div className={style.searchResultDetailsTitle}>
          <ReactMarkdown>{result.detailsTitle}</ReactMarkdown>
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
                  <ReactMarkdown>{d.title}</ReactMarkdown>
                </span>
                <ReactMarkdown>{d.desc}</ReactMarkdown>
              </li>
            ))}
          </ul>
          <div className={style.searchResultMore}>
            <ReactMarkdown>
              더 많은 정보가 여기에 표시됩니다. (임시 더미)
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
}
