import { useState, useCallback, useEffect } from "react";
import { useGetQuotes, useQuoteDetail, usePostQuote } from "@/api/Quote";
import type { Product } from "@/types/product";
import type { ProductItem } from "@/types/quote";
import {
  QUOTE_CATEGORIES,
  type QuoteCategoryKey,
  mapApiCategoryToQuoteCategory,
} from "@/constants/categories";
import { useSanitizedInput } from "./useSanitizedInput";
import { useQuoteStore } from "@/stores/useQuoteStore";

export type CategoryKey = QuoteCategoryKey;

export interface SelectedPart {
  product: Product | ProductItem;
  name: string;
  price: number;
  error: boolean;
}

export const useQuoteCart = () => {
  const { sanitize } = useSanitizedInput();
  
  // Zustand store
  const selectedParts = useQuoteStore((state) => state.selectedParts);
  const quoteName = useQuoteStore((state) => state.quoteName);
  const addPart = useQuoteStore((state) => state.addPart);
  const removePart = useQuoteStore((state) => state.removePart);
  const setSelectedParts = useQuoteStore((state) => state.setSelectedParts);
  const setQuoteNameStore = useQuoteStore((state) => state.setQuoteName);
  const clearQuoteStore = useQuoteStore((state) => state.clearQuote);

  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);

  // 견적 목록 가져오기
  const { data: quotesData } = useGetQuotes();
  const quotes = quotesData?.data || [];

  // 선택된 견적 상세 정보 가져오기
  const { data: quoteDetailData } = useQuoteDetail(selectedQuoteId || 0);

  // 견적 저장 mutation
  const { mutate: createQuote } = usePostQuote();

  // 총 가격 계산
  const totalPrice = Object.values(selectedParts).reduce((sum, part) => {
    return sum + (part?.price || 0);
  }, 0);

  // 부품 추가 핸들러
  const addToQuote = useCallback(
    (category: string, product: Product) => {
      const categoryKey = mapApiCategoryToQuoteCategory(category);
      
      if (!categoryKey) {
        console.warn(`Invalid category: ${category}`);
        return;
      }

      const part: SelectedPart = {
        product,
        name: sanitize(product.title),
        price: parseInt(product.lprice) || 0,
        error: false,
      };

      addPart(categoryKey, part);
    },
    [sanitize, addPart]
  );

  // 부품 제거 핸들러
  const removeFromQuote = useCallback(
    (category: CategoryKey) => {
      removePart(category);
    },
    [removePart]
  );

  // 견적 상세 정보 로드 시 selectedParts 업데이트
  useEffect(() => {
    if (quoteDetailData?.data) {
      const quote = quoteDetailData.data;
      console.log("📦 불러온 견적 데이터:", quote);
      setQuoteNameStore(quote.name);

      // API의 items를 selectedParts 형태로 변환
      const newSelectedParts = QUOTE_CATEGORIES.reduce(
        (acc, category) => {
          acc[category] = null;
          return acc;
        },
        {} as Record<CategoryKey, SelectedPart | null>
      );

      // items를 카테고리별로 매핑
      quote.items.forEach((item) => {
        console.log("🔍 아이템 카테고리:", item.category1, "→", mapApiCategoryToQuoteCategory(item.category1));
        const categoryKey = mapApiCategoryToQuoteCategory(item.category1);
        if (categoryKey) {
          newSelectedParts[categoryKey] = {
            product: item,
            name: sanitize(item.title),
            price: item.lprice,
            error: false,
          };
        } else {
          console.warn("❌ 매핑 실패:", item.title, "카테고리:", item.category1);
        }
      });

      console.log("✅ 최종 selectedParts:", newSelectedParts);
      setSelectedParts(newSelectedParts);
    }
  }, [quoteDetailData, setSelectedParts, setQuoteNameStore, sanitize]);

  // 이전 견적 선택 핸들러
  const selectQuote = useCallback((id: number) => {
    setSelectedQuoteId(id);
  }, []);

  // 견적 저장 핸들러
  const saveQuote = useCallback(
    (name?: string) => {
      // selectedParts를 ProductItem[] 형태로 변환하면서 카테고리 정보 추가
      const items: ProductItem[] = Object.entries(selectedParts)
        .filter(([, part]) => part !== null)
        .map(([category, part]) => {
          const product = part!.product;
          // lprice가 string일 수도 number일 수도 있으므로 변환
          const lprice = typeof product.lprice === 'string' 
            ? parseInt(product.lprice) || 0 
            : product.lprice;
          const hprice = product.hprice 
            ? (typeof product.hprice === 'string' ? parseInt(product.hprice) || null : product.hprice)
            : null;
          
          return {
            product_id: product.product_id,
            title: product.title,
            lprice,
            hprice,
            image: product.image,
            link: product.link,
            brand: product.brand,
            mall_name: product.mall_name,
            product_type: product.product_type,
            maker: product.maker,
            category1: category, // 우리가 사용하는 카테고리로 덮어씀
            category2: product.category2,
            category3: product.category3,
            category4: product.category4,
          };
        });

      const quoteName = name || `견적서 ${new Date().toLocaleDateString()}`;

      console.log("💾 저장할 데이터:", { name: quoteName, items });

      createQuote(
        {
          name: quoteName,
          items,
        },
        {
          onSuccess: () => {
            alert("견적이 저장되었습니다.");
          },
          onError: (error) => {
            console.error("견적 저장 실패:", error);
            alert("견적 저장에 실패했습니다.");
          },
        }
      );
    },
    [selectedParts, createQuote]
  );

  // 전체 초기화
  const clearQuote = useCallback(() => {
    clearQuoteStore();
  }, [clearQuoteStore]);

  // quoteName setter
  const handleSetQuoteName = useCallback(
    (name: string) => {
      setQuoteNameStore(name);
    },
    [setQuoteNameStore]
  );

  return {
    selectedParts,
    quotes,
    totalPrice,
    quoteName,
    setQuoteName: handleSetQuoteName,
    addToQuote,
    removeFromQuote,
    selectQuote,
    saveQuote,
    clearQuote,
  };
};
