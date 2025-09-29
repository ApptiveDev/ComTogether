import { useSearchChatBotStore } from "../../../stores/useSearchChatBotStore";
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

export default function RecentSearchItem({ keyword }: RecentSearchItemProps) {
  const { setSearch, handleSearch, handleRemoveRecent } =
    useSearchChatBotStore();
  const onClick = () => {
    setSearch(keyword);
    setTimeout(() => {
      handleSearch();
    }, 0);
  };
  return (
    <div className="recent-search-item" style={style} onClick={onClick}>
      {keyword}
      <span
        className="recent-search-remove"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveRecent(keyword);
        }}
      >
        &nbsp;
        <img src={delete_recent_search} alt="Remove" />
      </span>
    </div>
  );
}