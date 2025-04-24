// app/store/[id]/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { fetchProductById, Product } from "@/lib/api"
import styles from "../store.module.css"
import { usePathname } from "next/navigation"

export default function ProductDetail({ params }: { params: { id: string } }) {
  // 안내문 상태 추가
  const [showAddedAlert, setShowAddedAlert] = useState(false);
  // URL 경로에서 ID 추출
  const pathname = usePathname();
  const idFromPath = pathname.split('/').pop() || '';
  const productId = parseInt(idFromPath, 10);

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError(null)
        
        if (isNaN(productId)) {
          throw new Error("유효하지 않은 상품 ID입니다.")
        }
        
        const data = await fetchProductById(productId)
        setProduct(data)
        
        // 재고가 있는 경우에만 수량을 1로 초기화, 없으면 0
        setQuantity(data.stockQuantity > 0 ? 1 : 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : '상품 정보를 불러오는데 실패했습니다.')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const incrementQuantity = useCallback(() => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(quantity + 1)
    }
  }, [quantity, product])

  const decrementQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }, [quantity])

  const handleAddToCart = useCallback(() => {
    if (product && quantity > 0) {
      addItem({
        id: product.itemIdx,
        productIdx: product.itemIdx,
        productName: product.itemName,
        price: product.price,
        quantity,
        image: product.imageUrl || '/placeholder.jpg'
      });
      // 안내문 표시
      setShowAddedAlert(true);
      setTimeout(() => setShowAddedAlert(false), 2000); // 2초 후 안내문 숨김
      // 카트에 추가 후 수량 초기화
      setQuantity(1);
    }
  }, [product, quantity, addItem]);

  const formatCategory = useCallback((category: string | undefined): string => {
    if (!category) return "기타"

    // 카테고리 맵핑
    const categoryMap: { [key: string]: string } = {
      "signature": "시그니처 컬렉션",
      "wellness": "힐링 & 웰니스",
      "eco": "에코 & 지속가능",
      "food": "식음료 제품",
      "room": "객실별 컬렉션",
      "memory": "메모리 아이템",
      // 서브카테고리
      "aroma": "아로마 & 디퓨저",
      "bath": "목욕 제품",
      "bedding": "침구 & 가운",
      // 기타 서브카테고리...
    }

    // 슬래시 또는 하이픈 형식의 카테고리 처리
    if (category.includes("/") || category.includes("-")) {
      const separator = category.includes("/") ? "/" : "-"
      const [main, sub] = category.split(separator)
      
      const mainLabel = categoryMap[main] || main
      const subLabel = categoryMap[sub] || sub
      
      return `${mainLabel} > ${subLabel}`
    }
    
    return categoryMap[category] || category
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 py-8 text-center">
          {error || '상품을 찾을 수 없습니다.'}
        </div>
        <div className="text-center mt-4">
          <Link href="/store" className="inline-block px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">
            스토어로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 장바구니 추가 안내문 */}
      {showAddedAlert && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 bg-teal-600 text-white rounded shadow-md animate-fade-in-out font-semibold">
          장바구니에 추가되었습니다.
        </div>
      )}
      {/* 제품 헤더 */}
      <div className={styles.header}>
        <div className="container mx-auto px-4">
          <h1>{product.itemName}</h1>
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>홈</Link>
            <span className={styles.breadcrumbSeparator}><ChevronRight size={14} /></span>
            <Link href="/store" className={styles.breadcrumbLink}>기프트샵</Link>
            <span className={styles.breadcrumbSeparator}><ChevronRight size={14} /></span>
            <span className={styles.breadcrumbCurrent}>{product.itemName}</span>
          </div>
        </div>
      </div>

      {/* 제품 상세 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 제품 이미지 */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md">
            <Image
              src={product.imageUrl || "/placeholder.jpg"}
              alt={product.itemName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* 제품 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-2 text-teal-600">
              {formatCategory(product.category)}
            </div>
            <h1 className="text-2xl font-bold mb-4">{product.itemName}</h1>
            <p className="text-3xl font-semibold mb-6 text-teal-700">
              {new Intl.NumberFormat('ko-KR').format(product.price)}원
            </p>
            
            <div className="border-t border-b py-6 my-6">
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            {/* 재고 및 수량 선택 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">수량</span>
                <span className={`${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'} font-medium`}>
                  {product.stockQuantity > 0 
                    ? `재고: ${product.stockQuantity}개 남음` 
                    : '품절'}
                </span>
              </div>
              
              {product.stockQuantity > 0 ? (
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 border rounded-l-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= product.stockQuantity) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 text-center border-t border-b h-full py-2"
                    min="1"
                    max={product.stockQuantity}
                  />
                  <button 
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stockQuantity}
                    className="p-2 border rounded-r-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <div className="py-2 px-4 rounded bg-gray-100 text-gray-500 text-center">
                  현재 재고가 없습니다
                </div>
              )}
            </div>
            
            {/* 장바구니 추가 버튼 */}
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="w-full py-3 bg-teal-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <ShoppingCart size={20} />
              {product.stockQuantity > 0 ? '장바구니에 추가' : '품절된 상품입니다'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
