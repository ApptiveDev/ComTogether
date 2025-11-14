import { memo, useCallback } from "react";
import { useSearchGlossaryStore } from "../../../stores/useSearchGlossaryStore";
import delete_recent_search from "@/assets/image/icon/delete_recent_search.svg";

interface RecentSearchItemProps {
  keyword: string;
  onRemove: (keyword: string) => void;
}

const style = {
  display: "flex",
  background: "#F5f5f5",
  borderRadius: "5px",
  border: "1px solid #E7E7E7",
  padding: "8px 16px",
  marginRight: "8px",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "15px",
  color: "#888",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  height: "40px",
  fontWeight: "500",
  stroke: "#888",
  cursor: "pointer",
};

function RecentSearchItem({ keyword, onRemove }: RecentSearchItemProps) {
  const { setSelectedGlossaryId, addRecentSearch, setHasSearched } =
    useSearchGlossaryStore();

  const onClick = useCallback(async () => {
    // 최근 검색어를 클릭하면 바로 해당 용어로 검색
    setSelectedGlossaryId(keyword);
    addRecentSearch(keyword);
    setHasSearched(true);
  }, [keyword, setSelectedGlossaryId, addRecentSearch, setHasSearched]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(keyword);
    },
    [keyword, onRemove]
  );

  return (
    <div className="recent-search-item" style={style} onClick={onClick}>
      {keyword}
      <span className="recent-search-remove" onClick={handleRemove}>
        &nbsp;
        <img src={delete_recent_search} alt="Remove" />
      </span>
    </div>
  );
}

export default memo(RecentSearchItem);
