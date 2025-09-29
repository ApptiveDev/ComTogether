import { create } from "zustand";
import { persist } from "zustand/middleware";
import dummy_chatBot from "../dummy/dummy_chatBot.json";

export type DummyChatBotItem = {
  keyword: string;
  title: string;
  highlight: string;
  description: string;
  detailsTitle: string;
  details: { title: string; desc: string }[];
};

interface SearchChatBotState {
  search: string;
  recentSearches: string[];
  result: DummyChatBotItem | null;
  showMore: boolean;
  hasSearched: boolean;
  setSearch: (v: string) => void;
  handleSearch: () => void;
  handleRemoveRecent: (keyword: string) => void;
  setShowMore: (v: boolean) => void;
  useClearRecentSearches: () => void;
}

export const useSearchChatBotStore = create<SearchChatBotState>()(
  persist(
    (set, get) => ({
      search: "",
      recentSearches: [],
      result: null,
      showMore: false,
      hasSearched: false,
      setSearch: (v) => set({ search: v }),
      handleSearch: () => {
        const search = get().search.trim();
        if (!search) return;
        set((state) => ({
          recentSearches: [search, ...state.recentSearches.filter((item) => item !== search)].slice(0, 6),
        }));
        const found = (dummy_chatBot as DummyChatBotItem[]).find(
          (item) => item.keyword.toLowerCase() === search.toLowerCase()
        );
        set({ result: found || null, showMore: false, search: "", hasSearched: true });
      },
      handleRemoveRecent: (keyword) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((v) => v !== keyword),
        }));
      },
      setShowMore: (v) => set({ showMore: v }),
      useClearRecentSearches: () => {
        set({ recentSearches: [] });
      },
      
    }),
    {
      name: "search-chatbot-store",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
