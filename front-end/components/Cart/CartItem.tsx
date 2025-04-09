'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { fetchProductById } from '@/lib/api';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const CartItem: React.FC<CartItemProps> = ({ id, name, price, quantity, image }) => {
  const { updateQuantity, removeItem } = useCart();
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductStock = async () => {
      try {
        const product = await fetchProductById(id);
        setStockQuantity(product.stockQuantity);
        setLoading(false);
      } catch (error) {
        console.error('상품 재고 정보를 불러오는데 실패했습니다:', error);
        setLoading(false);
      }
    };

    loadProductStock();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0 && newQuantity <= stockQuantity) {
      updateQuantity(id, newQuantity);
    }
  };

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="flex items-center p-4 border-b">
      {image && (
        <div className="mr-4">
          <Image src={image} alt={name} width={60} height={60} className="rounded" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-600">{price.toLocaleString()}원</p>
        <p className="text-sm text-gray-500">재고: {stockQuantity}개</p>
      </div>
      <div className="flex items-center">
        <button 
          className="px-2 py-1 border rounded-l"
          onClick={() => updateQuantity(id, quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b">{quantity}</span>
        <button 
          className="px-2 py-1 border rounded-r"
          onClick={() => updateQuantity(id, quantity + 1)}
          disabled={quantity >= stockQuantity}
        >
          +
        </button>
      </div>
      <div className="ml-4 font-medium">{(price * quantity).toLocaleString()}원</div>
      <button 
        className="ml-4 text-red-500"
        onClick={() => removeItem(id)}
      >
        삭제
      </button>
    </div>
  );
};