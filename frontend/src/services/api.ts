import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Product {
  _id?: string;
  name: string;
  category: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceHistory: {
    price: number;
    date: string | Date;
  }[];
  url: string;
  currency: string; // 'KRW' | 'USD' | 'JPY' 등
  lastUpdated: string | Date;
}

// 날짜 문자열을 Date 객체로 변환하는 함수
const convertDates = (product: any): Product => {
  return {
    ...product,
    priceHistory: product.priceHistory.map((history: any) => ({
      ...history,
      date: new Date(history.date)
    })),
    lastUpdated: new Date(product.lastUpdated)
  };
};

export const productApi = {
  // 모든 제품 조회
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data.map(convertDates);
    } catch (error) {
      console.error('제품 목록 조회 실패:', error);
      throw error;
    }
  },

  // 특정 제품 조회
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return convertDates(response.data);
    } catch (error) {
      console.error('제품 조회 실패:', error);
      throw error;
    }
  },

  // 제품 생성
  createProduct: async (product: Omit<Product, '_id'>): Promise<Product> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, product);
      return convertDates(response.data);
    } catch (error) {
      console.error('제품 생성 실패:', error);
      throw error;
    }
  },

  // 제품 수정
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, product);
      return convertDates(response.data);
    } catch (error) {
      console.error('제품 수정 실패:', error);
      throw error;
    }
  },

  // 제품 삭제
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
    } catch (error) {
      console.error('제품 삭제 실패:', error);
      throw error;
    }
  }
}; 