import { useState } from "react";
import dummy_chatBot from "../../dummy/dummy_chatBot.json";

export type DummyChatBotItem = {
  keyword: string;
  title: string;
  highlight: string;
  description: string;
  detailsTitle: string;
  details: { title: string; desc: string }[];
};

export function useSearchChatBot() {
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [result, setResult] = useState<DummyChatBotItem | null>(null);
  const [showMore, setShowMore] = useState(false);

  const handleSearch = () => {
    if (search.trim() === "") return;
    setRecentSearches((prev) => [search, ...prev.filter((item) => item !== search)].slice(0, 6));
    const found = (dummy_chatBot as DummyChatBotItem[]).find(
      (item) => item.keyword.toLowerCase() === search.trim().toLowerCase()
    );
    setResult(found || null);
    setShowMore(false);
  };

  const handleRemoveRecent = (item: string) => {
    setRecentSearches((prev) => prev.filter((v) => v !== item));
  };

  return {
    search,
    setSearch,
    recentSearches,
    handleSearch,
    handleRemoveRecent,
    result,
    showMore,
    setShowMore,
  };
}
