// app/store/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchProducts, Product } from '@/lib/api';

export default function StorePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('상품 목록 로딩 시작');
        const data = await fetchProducts();
        console.log('받은 상품 데이터:', data);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('상품 로딩 오류:', err);
        setError(err instanceof Error ? err.message : '상품을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductClick = (itemIdx: number) => {
    router.push(`/store/${itemIdx}`);
  };

  if (loading) return <div className="container mx-auto p-4">로딩 중...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">오류: {error}</div>;
  if (products.length === 0) return <div className="container mx-auto p-4">등록된 상품이 없습니다.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">호텔 스토어</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.itemIdx}
            onClick={() => handleProductClick(product.itemIdx)}
            className="cursor-pointer border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-64">
              <Image
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.itemName}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.itemName}</h2>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="text-lg font-bold">{product.price.toLocaleString()}원</p>
              <p className="text-sm text-gray-500">재고: {product.stockQuantity}개</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
