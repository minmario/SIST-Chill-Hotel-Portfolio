const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';
console.log('API 호출 URL:', `${API_BASE_URL}/gift-shop`);

export async function fetchProducts() {
  try {
    console.log('API 호출 시작:', `${API_BASE_URL}/gift-shop`);
    const response = await fetch(`${API_BASE_URL}/gift-shop`);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API 응답 오류:', response.status, errorText);
        throw new Error(`상품 목록을 불러오는데 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      return data;
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
      throw error;
    }
  }

export async function fetchProductById(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/gift-shop/${id}`);
    if (!response.ok) {
      throw new Error('상품 상세 정보를 불러오는데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
}