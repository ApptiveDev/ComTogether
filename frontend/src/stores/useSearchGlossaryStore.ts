import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GlossaryDetail } from "@/types/glossary";

interface SearchGlossaryState {
  recentSearches: string[];
  selectedGlossaryId: string | null; // 용어명(term)을 저장
  result: GlossaryDetail | null;
  showMore: boolean;
  hasSearched: boolean;
  setSelectedGlossaryId: (id: string | null) => void;
  setResult: (result: GlossaryDetail | null) => void;
  handleRemoveRecent: (keyword: string) => void;
  setShowMore: (v: boolean) => void;
  clearRecentSearches: () => void;
  setHasSearched: (v: boolean) => void;
  addRecentSearch: (keyword: string) => void;
}

export const useSearchGlossaryStore = create<SearchGlossaryState>()(
  persist(
    (set) => ({
      recentSearches: [],
      selectedGlossaryId: null,
      result: null,
      showMore: false,
      hasSearched: false,
      setSelectedGlossaryId: (id) => set({ selectedGlossaryId: id }),
      setResult: (result) => set({ result, hasSearched: true }),
      addRecentSearch: (keyword) => {
        set((state) => ({
          recentSearches: [keyword, ...state.recentSearches.filter((item) => item !== keyword)].slice(0, 6),
        }));
      },
      handleRemoveRecent: (keyword) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((v) => v !== keyword),
        }));
      },
      setShowMore: (v) => set({ showMore: v }),
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
      setHasSearched: (v) => set({ hasSearched: v }),
    }),
    {
      name: "search-glossary-store",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
