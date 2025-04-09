'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './auth-context';

interface CartItem {
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
    if (isLoggedIn) {
      fetchUserCart();
    } else {
      // 비회원 장바구니 로드
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        setItems(JSON.parse(guestCart));
      }
    }
  }, [isLoggedIn]);

  // 장바구니 데이터 로드
  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('토큰이 없습니다. 로그인이 필요합니다.');
        setItems([]);
        return;
      }

      // 토큰 디코딩하여 만료 시간 확인
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000; // JWT exp는 초 단위
      
      if (Date.now() >= expirationTime) {
        console.error('토큰이 만료되었습니다. 다시 로그인이 필요합니다.');
        localStorage.removeItem('token');
        setItems([]);
        return;
      }

      console.log('장바구니 데이터 요청 중...');
      const response = await axios.get('http://localhost:8080/api/v1/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('장바구니 데이터 응답:', response.data);
      
      // 응답이 배열 형태로 반환
      setItems(response.data || []);
    } catch (error) {
      console.error('장바구니 데이터를 불러오는데 실패했습니다:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // 인증 실패 시 토큰 제거
        localStorage.removeItem('token');
      }
      setItems([]);
    }
  };

  // 상품 추가
  const addItem = async (item: Omit<CartItem, 'cartItemIdx' | 'subtotal'>) => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8080/api/v1/cart/items', {
          productIdx: item.productIdx,
          quantity: item.quantity
        }, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // 응답이 단일 항목이므로 현재 장바구니를 다시 로드
        await fetchUserCart();
      } catch (error) {
        console.error('장바구니 추가 실패:', error);
        if (axios.isAxiosError(error) && error.response) {
          console.error('에러 상세:', error.response.data);
        }
      }
    } else {
      // 비회원 장바구니 처리
      setItems(prevItems => {
        const existingItem = prevItems.find(i => i.productIdx === item.productIdx);
        if (existingItem) {
          const updatedItems = prevItems.map(i =>
            i.productIdx === item.productIdx ? { ...i, quantity: i.quantity + item.quantity, subtotal: i.price * (i.quantity + item.quantity) } : i
          );
          localStorage.setItem('guestCart', JSON.stringify(updatedItems));
          return updatedItems;
        }
        // 임시 cartItemIdx 생성 (로컬 전용)
        const tempCartItemIdx = Date.now();
        const subtotal = item.price * item.quantity;
        const newItem = { ...item, cartItemIdx: tempCartItemIdx, subtotal };
        const newItems = [...prevItems, newItem];
        localStorage.setItem('guestCart', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  // 상품 수량 수정
  const updateQuantity = async (id: number, quantity: number) => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:8080/api/v1/cart/items/${id}`, {
          quantity: quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 단일 항목 업데이트 후 전체 장바구니 다시 로드
        await fetchUserCart();
      } catch (error) {
        console.error('장바구니 수정 실패:', error);
      }
    } else {
      setItems(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.cartItemIdx === id ? { ...item, quantity, subtotal: item.price * quantity } : item
        );
        localStorage.setItem('guestCart', JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  };

  // 상품 제거
  const removeItem = async (id: number) => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/v1/cart/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 항목 삭제 후 전체 장바구니 다시 로드
        await fetchUserCart();
      } catch (error) {
        console.error('장바구니 삭제 실패:', error);
      }
    } else {
      setItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.cartItemIdx !== id);
        localStorage.setItem('guestCart', JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  };

  // 장바구니 비우기
  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:8080/api/v1/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 장바구니 비운 후 빈 배열로 설정
        setItems([]);
      } catch (error) {
        console.error('장바구니 비우기 실패:', error);
      }
    } else {
      setItems([]);
      localStorage.removeItem('guestCart');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
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