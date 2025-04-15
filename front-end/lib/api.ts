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

const API_BASE_URL = 'http://localhost:8080/api/v1';

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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
    console.log(`카테고리로 상품 조회: ${category}`);
    
    // URL 인코딩은 한 번만 적용하기 위해 이미 인코딩된 문자열인지 확인
    const encodedCategory = category.includes('%') ? category : encodeURIComponent(category);
    
    // 슬래시(/)가 포함된 카테고리는 서버에서 처리 가능한 형식으로 변환
    // URL에 슬래시가 포함되면 Spring에서 경로 변수로 해석하는 문제가 발생할 수 있음
    const categoryParam = encodedCategory.replace(/%2F/g, '-');
    
    let url = `${API_BASE_URL}/gift-shop/category/${categoryParam}`;
    
    // 정렬 옵션이 있는 경우 쿼리 파라미터 추가
    if (sortBy && sortDirection) {
      url += `?sortBy=${sortBy}&sortDirection=${sortDirection}`;
    }
    
    console.log(`API 요청 URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`서버 오류 응답: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`카테고리별 상품을 불러오는데 실패했습니다. 상태 코드: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`카테고리 ${category}의 상품 수: ${data.length}`);
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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