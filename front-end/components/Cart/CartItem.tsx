'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const CartItem: React.FC<CartItemProps> = ({ id, name, price, quantity, image }) => {
  const { updateQuantity, removeItem } = useCart();

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
      </div>
      <div className="flex items-center">
        <button 
          className="px-2 py-1 border rounded-l"
          onClick={() => updateQuantity(id, quantity - 1)}
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b">{quantity}</span>
        <button 
          className="px-2 py-1 border rounded-r"
          onClick={() => updateQuantity(id, quantity + 1)}
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