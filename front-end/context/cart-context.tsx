'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  
  // 장바구니 데이터 로드 함수를 먼저 선언
  const fetchUserCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return; // 로컬 데이터 유지
      }

      // 토큰 디코딩하여 만료 시간 확인
      try {
        if (!token || token.split('.').length !== 3) {
          throw new Error('JWT 토큰 형식이 잘못되었습니다.');
        }
      
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const tokenPayload = JSON.parse(atob(base64));
      
        const expirationTime = tokenPayload.exp * 1000;
        if (Date.now() >= expirationTime) {
          localStorage.removeItem('accessToken');
          return;
        }
      } catch (decodeError) {
        return;
      }

      const response = await axios.get('/api/v1/cart');
      
      if (response.data && Array.isArray(response.data)) {
        setItems(response.data);
        // 서버 데이터를 로컬에도 동기화
        localStorage.setItem('guestCart', JSON.stringify(response.data));
      } 
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('accessToken');
      }
    }
  }, []);
  
  // 초기 로드 및 로그인 상태 체크
  useEffect(() => {
    // 결제 완료 플래그 확인
    const paymentCompleted = localStorage.getItem('paymentCompleted');
    if (paymentCompleted === 'true') {
      // 장바구니 비우기
      setItems([]);
      localStorage.removeItem('guestCart');
      localStorage.removeItem('paymentCompleted');
      console.log('결제 완료 플래그 감지: 장바구니 초기화 완료');
      return;
    }
    
    // 결제 성공 페이지에서 설정한 cartCleared 플래그 확인
    const cartCleared = localStorage.getItem('cartCleared');
    if (cartCleared === 'true') {
      // 장바구니 비우기
      setItems([]);
      localStorage.removeItem('guestCart');
      localStorage.removeItem('cartCleared');
      console.log('장바구니 비우기 플래그 감지: 장바구니 초기화 완료');
      return;
    }
    
    // 시작할 때는 로컬 데이터 먼저 로드
    const guestCart = localStorage.getItem('guestCart');
    if (guestCart) {
      try {
        setItems(JSON.parse(guestCart));
      } catch (e) {
        console.error('장바구니 데이터 파싱 오류:', e);
        localStorage.removeItem('guestCart');
      }
    }
    
    // 로그인 상태라면 서버 데이터 로드 시도
    if (isLoggedIn) {
      fetchUserCart();
    }
  }, [isLoggedIn, fetchUserCart]);

  // 상품 추가
  const addItem = useCallback(async (item: Omit<CartItem, 'cartItemIdx' | 'subtotal'>) => {
    // 유효하지 않은 productIdx 체크
    if (!item.productIdx || isNaN(item.productIdx)) {
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
        await axios.post('/api/v1/cart/items', {
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
        // 서버 추가 실패 시 로컬 데이터는 이미 업데이트되었으므로 무시
      }
    }
  }, [isLoggedIn, fetchUserCart]);

  // 상품 수량 수정
  const updateQuantity = useCallback(async (id: number, quantity: number) => {
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
        await axios.put(`/api/v1/cart/items/${id}`, {
          quantity: quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 성공 시 최신 데이터 가져오기 시도
        fetchUserCart();
      } catch (error) {
        // 서버 업데이트 실패 시 로컬 데이터는 이미 업데이트되었으므로 무시
      }
    }
  }, [isLoggedIn, fetchUserCart]);

  // 상품 제거
  const removeItem = useCallback(async (id: number) => {
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
        await axios.delete(`/api/v1/cart/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 성공 시 최신 데이터 가져오기 시도
        fetchUserCart();
      } catch (error) {
        // 서버 삭제 실패 시 로컬 데이터는 이미 업데이트되었으므로 무시
      }
    }
  }, [isLoggedIn, fetchUserCart]);

  // 장바구니 비우기
  const clearCart = useCallback(async () => {
    // 로컬 데이터 비우기
    setItems([]);
    localStorage.removeItem('guestCart');
    
    // 로그인 상태이면 서버에서도 비우기 시도
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete('/api/v1/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // 서버 삭제 실패 시 무시
      }
    }
  }, [isLoggedIn]);

  // 장바구니 항목 초기화 (외부에서 호출 가능)
  const clearCartItems = useCallback(() => {
    setItems([]);
  }, []);

  // 장바구니 초기화 함수 등록
  useEffect(() => {
    registerCartClear(clearCartItems);
  }, [clearCartItems]);

  // 메모이제이션 적용
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items]);

  // context 값 메모이제이션
  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    clearCartItems,
    totalItems,
    totalPrice,
    isLoggedIn
  }), [items, addItem, removeItem, updateQuantity, clearCart, clearCartItems, totalItems, totalPrice, isLoggedIn]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// useCart 훅 최적화
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
