'use client';

import { useCart } from '@/context/cart-context';
import { CartItem } from '@/components/Cart/CartItem';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  // JWT 관련 상태
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    /* JWT 관련 코드 - 나중에 활성화
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰 유효성 검사
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(!!data.user);
      });
    }
    */
  }, []);

  const handleCheckout = () => {
    /* JWT 관련 코드 - 나중에 활성화
    if (!isLoggedIn) {
      // 로그인 페이지로 리다이렉트
      alert('결제를 진행하려면 로그인이 필요합니다.');
      router.push('/login?redirect=/cart');
      return;
    }
    */
    
    // 결제 페이지로 이동
    // window.location.href = '/checkout';
    alert('결제 페이지로 이동합니다.');
  };

  if (totalItems === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>
        <div className="text-center py-10">
          <p className="mb-4">장바구니가 비어있습니다.</p>
          <Link href="/products" className="text-blue-500 hover:underline">
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">장바구니 ({totalItems}개)</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex">
          <div className="flex-1">상품정보</div>
          <div className="w-32 text-center">수량</div>
          <div className="w-32 text-center">가격</div>
          <div className="w-20 text-center">삭제</div>
        </div>
        
        <div>
          {items.map(item => (
            <CartItem 
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              image={item.image}
            />
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <button 
            onClick={clearCart}
            className="px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-50"
          >
            장바구니 비우기
          </button>
          <div className="text-xl font-bold">
            합계: {totalPrice.toLocaleString()}원
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Link href="/products" className="px-6 py-3 mr-4 bg-gray-200 rounded hover:bg-gray-300">
          쇼핑 계속하기
        </Link>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          주문하기
        </button>
      </div>
    </div>
  );
}