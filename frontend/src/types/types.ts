export interface Product {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceHistory: PriceHistory[];
  url: string;
  source: string;
  lastUpdated: string;
}

export interface PriceHistory {
  date: string;
  price: number;
  source: string;
}

export interface SearchFilters {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  source?: string;
} 