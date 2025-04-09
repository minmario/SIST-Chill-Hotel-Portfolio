// API 타입 정의
export interface Product {
  itemIdx: number;
  itemName: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 전체 상품 목록 조회
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-shop`);
    if (!response.ok) {
      throw new Error('상품 목록을 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    console.log('Fetched products:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// 단일 상품 상세 조회
export async function fetchProductById(itemIdx: number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-shop/${itemIdx}`);
    if (!response.ok) {
      throw new Error('상품을 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    console.log('Fetched product:', data);
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// 카테고리별 상품 조회
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-shop/category/${category}`);
    if (!response.ok) {
      throw new Error('카테고리별 상품을 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

// 키워드로 상품 검색
export async function searchProducts(keyword: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-shop/search?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
      throw new Error('상품 검색에 실패했습니다.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}