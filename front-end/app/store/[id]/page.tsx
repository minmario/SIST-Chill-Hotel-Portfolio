// app/store/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById } from '@/lib/api';
import { useCart } from '@/context/cart-context';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productId = Number(params.id);
    if (isNaN(productId)) {
      setError('유효하지 않은 상품 ID입니다.');
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (loading) return <div className="container mx-auto p-4">로딩 중...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">오류: {error}</div>;
  if (!product) return <div className="container mx-auto p-4">상품을 찾을 수 없습니다.</div>;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.itemIdx,
      name: product.itemName,
      price: product.price,
      quantity: quantity,
      image: product.imageUrl
    });
    
    alert(`${product.itemName} ${quantity}개를 장바구니에 추가했습니다.`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="relative h-96 w-full">
            <Image
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.itemName}
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.itemName}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-2xl font-bold mb-6">{Number(product.price).toLocaleString()}원</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">상품 설명</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="quantity" className="block mb-2">수량 (재고: {product.stockQuantity}개)</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stockQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded p-2 w-20"
            />
          </div>
          
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
            disabled={product.stockQuantity < 1}
          >
            {product.stockQuantity < 1 ? '품절' : '장바구니에 추가'}
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">상품 정보</h2>
        <div className="border-t border-gray-200">
          <div className="py-3 flex border-b border-gray-200">
            <span className="w-1/3 font-semibold">카테고리</span>
            <span className="w-2/3">{product.category}</span>
          </div>
          <div className="py-3 flex border-b border-gray-200">
            <span className="w-1/3 font-semibold">등록일</span>
            <span className="w-2/3">{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="py-3 flex border-b border-gray-200">
            <span className="w-1/3 font-semibold">최종 수정일</span>
            <span className="w-2/3">{new Date(product.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
