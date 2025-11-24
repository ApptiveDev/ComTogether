import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types/product";
import {
  QUOTE_CATEGORIES,
  type QuoteCategoryKey,
} from "@/constants/categories";

export type CategoryKey = QuoteCategoryKey;

export interface SelectedPart {
  product: Product;
  name: string;
  price: number;
  error: boolean;
}

interface QuoteState {
  selectedParts: Record<CategoryKey, SelectedPart | null>;
  quoteName: string;
  
  // 부품 추가
  addPart: (category: CategoryKey, part: SelectedPart) => void;
  
  // 부품 제거
  removePart: (category: CategoryKey) => void;
  
  // 견적 전체 설정
  setSelectedParts: (parts: Record<CategoryKey, SelectedPart | null>) => void;
  
  // 견적 이름 설정
  setQuoteName: (name: string) => void;
  
  // 견적 초기화
  clearQuote: () => void;
}

// 빈 견적 상태 생성 헬퍼
const createEmptyQuoteState = () => ({
  selectedParts: QUOTE_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = null;
      return acc;
    },
    {} as Record<CategoryKey, SelectedPart | null>
  ),
  quoteName: "",
});

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      ...createEmptyQuoteState(),

      addPart: (category, part) => {
        set((state) => ({
          selectedParts: {
            ...state.selectedParts,
            [category]: part,
          },
        }));
      },

      removePart: (category) => {
        set((state) => ({
          selectedParts: {
            ...state.selectedParts,
            [category]: null,
          },
        }));
      },

      setSelectedParts: (parts) => {
        set({ selectedParts: parts });
      },

      setQuoteName: (name) => {
        set({ quoteName: name });
      },

      clearQuote: () => {
        set(createEmptyQuoteState());
      },
    }),
    {
      name: "quote-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
