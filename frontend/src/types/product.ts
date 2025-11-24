// 제품 관련 타입 정의

export interface Product {
  product_id: string;
  title: string;
  lprice: string;
  hprice: string;
  image: string;
  link: string;
  mall_name: string;
  product_type: string;
  maker: string;
  brand: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
}

export interface ProductListResponse {
  total: number;
  start: number;
  display: number;
  items: Product[];
}

export interface GetProductsParams {
  category: string;
  query?: string;
  display?: number;
  start?: number;
  sort?: 'sim' | 'date' | 'asc' | 'dsc';
  exclude?: string;
  [key: string]: unknown;
}

export interface GetRecommendedProductsParams {
  category: string;
  query?: string;
  display?: number;
  start?: number;
  sort?: 'sim' | 'date' | 'asc' | 'dsc';
  exclude?: string;
  [key: string]: unknown;
}
