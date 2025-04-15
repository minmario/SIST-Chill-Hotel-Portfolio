// app/store/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById } from '@/lib/api';
import { useCart } from '@/context/cart-context';

interface Product {
  itemIdx: number;
  itemName: string;
  price: number;
  description: string;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 카테고리 문자열 포맷 함수
const formatCategory = (category: string): string => {
  if (!category) return '기타';
  
  // 카테고리 경로에서 메인 카테고리와 서브 카테고리 추출
  const segments = category.split('/');
  
  // 카테고리 표시 맵핑
  const categoryMap: Record<string, string> = {
    'signature': '시그니처 컬렉션',
    'wellness': '힐링 & 웰니스 컬렉션',
    'eco': '에코 & 지속가능한 라이프스타일',
    'food': '휴식을 위한 식음료 제품',
    'room': '객실 등급별 맞춤 컬렉션',
    'memory': '메모리 & 컬렉터블 아이템',
    // 서브 카테고리
    'aroma': '아로마 & 디퓨저',
    'bath': '목욕 제품',
    'bedding': '침구 & 가운',
    'meditation': '명상 & 요가',
    'sleep': '수면 & 릴렉스',
    'aromatherapy': '아로마테라피',
    'eco-living': '친환경 생활용품',
    'organic': '유기농 퍼스널 케어',
    'travel': '지속가능한 여행용품',
    'tea': '차 & 티웨어',
    'organic-food': '유기농 식품',
    'wine': '와인 & 음료',
    'comfort': '컴포트 & 하모니 컬렉션',
    'family': '패밀리 & 레이크 컬렉션',
    'ultimate': '얼티메이트 컬렉션',
    'photo': '포토 & 아트',
    'miniature': '미니어처 & 피규어',
    'seasonal': '시즌 & 한정판 컬렉션',
  };
  
  if (segments.length === 1) {
    return categoryMap[segments[0]] || segments[0];
  }
  
  const mainCategory = categoryMap[segments[0]] || segments[0];
  const subCategory = categoryMap[segments[1]] || segments[1];
  
  return `${mainCategory} > ${subCategory}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError(err instanceof Error ? err.message : '상품을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (loading) return <div className="container mx-auto p-4">로딩 중...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">오류: {error}</div>;
  if (!product) return <div className="container mx-auto p-4">상품을 찾을 수 없습니다.</div>;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleQuantityIncrement = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productIdx: product.itemIdx,
      productName: product.itemName,
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
          <p className="text-gray-600 mb-4">{formatCategory(product.category)}</p>
          <p className="text-2xl font-bold mb-6">{Number(product.price).toLocaleString()}원</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">상품 설명</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="quantity" className="block mb-2">수량 (재고: {product.stockQuantity}개)</label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleQuantityDecrement}
                className="w-10 h-10 flex items-center justify-center border rounded-l hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 h-10 text-center border-t border-b [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={handleQuantityIncrement}
                className="w-10 h-10 flex items-center justify-center border rounded-r hover:bg-gray-100"
                disabled={quantity >= product.stockQuantity}
              >
                +
              </button>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition-colors"
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
            <span className="w-2/3">{formatCategory(product.category)}</span>
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
