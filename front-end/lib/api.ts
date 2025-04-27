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

// 정렬 기준 열거형
export enum SortBy {
  PRICE = 'price',
  NAME = 'name',
  NEWEST = 'newest'
}

// 정렬 방향 열거형
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

const API_BASE_URL = '/api/v1';

// API 요청시 인증 헤더 추가 함수
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// 전체 상품 목록 조회
export async function fetchProducts(sortBy?: SortBy, sortDirection?: SortDirection): Promise<Product[]> {
  try {
    let url = `${API_BASE_URL}/gift-shop`;
    
    // 정렬 옵션이 있는 경우 쿼리 파라미터 추가
    if (sortBy && sortDirection) {
      url += `?sortBy=${sortBy}&sortDirection=${sortDirection}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
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
export async function fetchProductById(productIdx: number): Promise<Product> {
  if (!productIdx || isNaN(productIdx)) {
    throw new Error('유효하지 않은 상품 ID입니다.');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/gift-shop/${productIdx}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
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
export async function fetchProductsByCategory(category: string, sortBy?: SortBy, sortDirection?: SortDirection): Promise<Product[]> {
  try {
    console.log(`카테고리로 상품 조회 시작: '${category}'`);
    
    // 카테고리 파라미터는 이미 적절히 구성됨 (하이픈 형식)
    const categoryParam = category;
    
    // 정렬 옵션이 있는 경우 쿼리 파라미터 추가
    let url = `${API_BASE_URL}/gift-shop/category/${categoryParam}`;
    if (sortBy && sortDirection) {
      url += `?sortBy=${sortBy}&sortDirection=${sortDirection}`;
    }
    
    console.log(`API 요청 URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'  // 기존과 일관성을 위해 include로 유지
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`서버 오류 응답: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`카테고리별 상품을 불러오는데 실패했습니다. 상태 코드: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`카테고리 '${category}' 조회 성공: ${data.length}개 상품`);
    
    // 디버깅을 위한 첫 번째 상품 정보 출력
    if (data.length > 0) {
      console.log(`첫 번째 상품: ${data[0].itemName}, 카테고리: ${data[0].category}`);
    }
    
    return data;
  } catch (error) {
    console.error('카테고리별 상품 조회 중 오류 발생:', error);
    throw error;
  }
}

// 키워드로 상품 검색
export async function searchProducts(keyword: string, sortBy?: SortBy, sortDirection?: SortDirection): Promise<Product[]> {
  try {
    let url = `${API_BASE_URL}/gift-shop/search?keyword=${encodeURIComponent(keyword)}`;
    
    // 정렬 옵션이 있는 경우 쿼리 파라미터 추가
    if (sortBy && sortDirection) {
      url += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
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

// 결제 API 호출
export async function initiatePayment(paymentData: any): Promise<any> {
  try {
    const response = await fetch(`/api/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`결제 요청 실패: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`결제 요청에 실패했습니다. 상태 코드: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('결제 초기화 중 오류 발생:', error);
    throw error;
  }
}

// 클라이언트 측에서 상품 정렬 (백엔드 정렬 API가 없는 경우 사용)
export function sortProducts(products: Product[], sortBy: SortBy, sortDirection: SortDirection): Product[] {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case SortBy.PRICE:
      sortedProducts.sort((a, b) => 
        sortDirection === SortDirection.ASC ? a.price - b.price : b.price - a.price
      );
      break;
    case SortBy.NAME:
      sortedProducts.sort((a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        if (sortDirection === SortDirection.ASC) {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
      break;
    case SortBy.NEWEST:
      sortedProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === SortDirection.ASC ? dateA - dateB : dateB - dateA;
      });
      break;
  }
  
  return sortedProducts;
}