'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';
import { isAxiosError } from 'axios';
import { useAuth, registerCartClear } from './auth-context';

interface CartItem {
  id: number; // 고유 식별자 추가
  cartItemIdx: number;
  productIdx: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemIdx' | 'subtotal'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  clearCartItems: () => void;
  totalItems: number;
  totalPrice: number;
  isLoggedIn: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isLoggedIn } = useAuth();
  
  // 초기 로드 및 로그인 상태 체크
  useEffect(() => {
    // 시작할 때는 로컬 데이터 먼저 로드
    const guestCart = localStorage.getItem('guestCart');
    if (guestCart) {
      setItems(JSON.parse(guestCart));
    }
    
    // 로그인 상태라면 서버 데이터 로드 시도
    if (isLoggedIn) {
      fetchUserCart();
    }
  }, [isLoggedIn]);

  // 장바구니 데이터 로드
  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('토큰이 없습니다. 로그인이 필요합니다.');
        return; // 로컬 데이터 유지
      }

      // 토큰 디코딩하여 만료 시간 확인
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenPayload.exp * 1000; // JWT exp는 초 단위
        
        if (Date.now() >= expirationTime) {
          console.error('토큰이 만료되었습니다. 다시 로그인이 필요합니다.');
          localStorage.removeItem('accessToken');
          return; // 로컬 데이터 유지
        }
      } catch (decodeError) {
        console.error('토큰 디코딩 오류:', decodeError);
        // 토큰 디코딩 실패 시 계속 진행
      }

      console.log('장바구니 데이터 요청 중...');
      const response = await axios.get('/api/v1/cart');
      console.log('장바구니 데이터 응답:', response.data);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // 응답이 배열 형태로 반환되었고 데이터가 있는 경우에만 설정
        setItems(response.data);
        // 서버 데이터를 로컬에도 동기화
        localStorage.setItem('guestCart', JSON.stringify(response.data));
      } 
      // 서버 데이터가 비어있더라도 로컬 데이터는 유지
    } catch (error: unknown) {
      console.error('장바구니 데이터를 불러오는데 실패했습니다:', error);
      if (isAxiosError(error) && error.response?.status === 401) {
        // 인증 실패 시 토큰 제거
        localStorage.removeItem('accessToken');
      }
      // API 호출 실패 시 로컬 데이터 유지
      console.log('로컬 장바구니 데이터를 사용합니다.');
    }
  };

  // 상품 추가
  const addItem = async (item: Omit<CartItem, 'cartItemIdx' | 'subtotal'>) => {
    // 유효하지 않은 productIdx 체크
    if (!item.productIdx || isNaN(item.productIdx)) {
      console.error('유효하지 않은 상품 ID입니다:', item);
      return;
    }
    
    // 임시 cartItemIdx 생성 (서버에서 덮어씀)
    const tempCartItemIdx = Date.now();
    const subtotal = item.price * item.quantity;
    const newItem = { ...item, cartItemIdx: tempCartItemIdx, subtotal };
    
    // 로컬 장바구니 업데이트
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.productIdx === item.productIdx);
      if (existingItem) {
        // 이미 존재하는 상품이면 수량만 업데이트
        const updatedItems = prevItems.map(i =>
          i.productIdx === item.productIdx ? { ...i, quantity: i.quantity + item.quantity, subtotal: i.price * (i.quantity + item.quantity) } : i
        );
        localStorage.setItem('guestCart', JSON.stringify(updatedItems));
        return updatedItems;
      }
      
      // 새 상품이면 추가
      const newItems = [...prevItems, newItem];
      localStorage.setItem('guestCart', JSON.stringify(newItems));
      return newItems;
    });
    
    // 로그인 상태이면 서버에도 추가 시도
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:8080/api/v1/cart/items', {
          productIdx: item.productIdx,
          quantity: item.quantity
        }, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // 서버에 추가 후 최신 데이터 가져오기 시도
        fetchUserCart();
      } catch (error) {
        console.error('장바구니 추가 실패:', error);
        if (axios.isAxiosError(error) && error.response) {
          console.error('에러 상세:', error.response.data);
        }
        // 서버 추가 실패 시 로컬 데이터는 이미 업데이트되었으므로 무시
      }
    }
  };

  // 상품 수량 수정
  const updateQuantity = async (id: number, quantity: number) => {
    // 먼저 로컬 데이터 업데이트
    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.cartItemIdx === id ? { ...item, quantity, subtotal: item.price * quantity } : item
      );
      localStorage.setItem('guestCart', JSON.stringify(updatedItems));
      return updatedItems;
    });
    
    // 로그인 상태이면 서버에도 업데이트 시도
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.put(`http://localhost:8080/api/v1/cart/items/${id}`, {
          quantity: quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 성공 시 최신 데이터 가져오기 시도
        fetchUserCart();
      } catch (error) {
        console.error('장바구니 수정 실패:', error);
        // 서버 업데이트 실패 시 로컬 데이터는 이미 업데이트되었으므로 무시
      }
    }
  };

  // 상품 제거
  const removeItem = async (id: number) => {
    // 먼저 로컬 데이터 업데이트
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.cartItemIdx !== id);
      localStorage.setItem('guestCart', JSON.stringify(updatedItems));
      return updatedItems;
    });
    
    // 로그인 상태이면 서버에서도 제거 시도
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`http://localhost:8080/api/v1/cart/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 성공 시 최신 데이터 가져오기 시도
        fetchUserCart();
      } catch (error) {
        console.error('장바구니 삭제 실패:', error);
        // 서버 삭제 실패 시 로컬 데이터는 이미 업데이트되었으므로 무시
      }
    }
  };

  // 장바구니 비우기
  const clearCart = async () => {
    // 로컬 데이터 비우기
    setItems([]);
    localStorage.removeItem('guestCart');
    
    // 로그인 상태이면 서버에서도 비우기 시도
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete('http://localhost:8080/api/v1/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('장바구니 비우기 실패:', error);
        // 서버 삭제 실패 시 무시
      }
    }
  };

  // 장바구니 항목 초기화 (외부에서 호출 가능)
  const clearCartItems = () => {
    console.log('[Cart] 장바구니 항목 초기화');
    setItems([]);
  };

  // 장바구니 초기화 함수 등록
  useEffect(() => {
    registerCartClear(clearCartItems);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      clearCartItems,
      totalItems,
      totalPrice,
      isLoggedIn
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
