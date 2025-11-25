// Quote 관련 타입 정의

export interface ProductItem {
  product_id: string;
  title: string;
  lprice: number;
  hprice: number | null;
  image: string;
  link: string;
  brand: string;
  mall_name: string;
  product_type: string;
  maker: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
  created_at?: string;
}

export interface Quote {
  quote_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  total_quantity: number;
  total_price: number;
  items: ProductItem[];
}

export interface CreateQuoteRequest {
  name: string;
  items: ProductItem[];
}

export interface UpdateQuoteRequest {
  name: string;
  items: ProductItem[];
}

export interface QuoteListResponse {
  quote_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  total_quantity: number;
  total_price: number;
}
