import { createContext, useContext, ReactNode } from "react";
import { useQuoteCart } from "@/hooks";
import type { Product } from "@/types/product";
import type { CategoryKey, SelectedPart } from "@/hooks";
import type { QuoteListResponse } from "@/types/quote";

interface QuoteCartContextValue {
  selectedParts: Record<CategoryKey, SelectedPart | null>;
  quotes: QuoteListResponse[];
  totalPrice: number;
  quoteName: string;
  setQuoteName: (name: string) => void;
  addToQuote: (category: string, product: Product) => void;
  removeFromQuote: (category: CategoryKey) => void;
  selectQuote: (id: number) => void;
  saveQuote: (name?: string) => void;
  clearQuote: () => void;
}

const QuoteCartContext = createContext<QuoteCartContextValue | undefined>(
  undefined
);

export const useQuoteCartContext = () => {
  const context = useContext(QuoteCartContext);
  if (!context) {
    throw new Error(
      "useQuoteCartContext must be used within QuoteCartProvider"
    );
  }
  return context;
};

interface QuoteCartProviderProps {
  children: ReactNode;
}

export const QuoteCartProvider = ({ children }: QuoteCartProviderProps) => {
  const quoteCart = useQuoteCart();

  return (
    <QuoteCartContext.Provider value={quoteCart}>
      {children}
    </QuoteCartContext.Provider>
  );
};
