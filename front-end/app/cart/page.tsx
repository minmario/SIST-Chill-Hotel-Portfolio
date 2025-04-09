"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { fetchProductById } from "@/lib/api"
import styles from "./cart.module.css"

interface CartItem {
  cartItemIdx: number;
  productIdx: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

interface StockQuantities {
  [key: number]: number;
}

export default function Cart() {
  const [mounted, setMounted] = useState(false)
  const { items: cartItems, updateQuantity, removeItem: removeFromCart, totalItems, totalPrice, isLoggedIn } = useCart()
  const [stockQuantities, setStockQuantities] = useState<StockQuantities>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadStockQuantities()
  }, [])

  const loadStockQuantities = async () => {
    try {
      const quantities: StockQuantities = {}
      for (const item of cartItems) {
        const product = await fetchProductById(item.productIdx)
        quantities[item.productIdx] = product.stockQuantity
      }
      setStockQuantities(quantities)
      setLoading(false)
    } catch (error) {
      console.error('재고 정보를 불러오는데 실패했습니다:', error)
      setLoading(false)
    }
  }

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!mounted || loading) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">장바구니 로딩 중...</h2>
        <p className="mb-6">잠시만 기다려주세요.</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="mb-8">
          <ShoppingBag size={64} className="mx-auto text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h2>
        <p className="mb-6">상품을 장바구니에 담아보세요.</p>
        <Link href="/store" className="button button-primary">
          쇼핑하러 가기
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>장바구니 {!isLoggedIn && "(비회원)"}</h1>
          <p>{cartItems.length}개의 상품이 장바구니에 있습니다.</p>
          {!isLoggedIn && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                로그인하시면 장바구니 상품을 저장하고 다음에도 이용하실 수 있습니다.
                <Link href="/login" className="ml-2 text-blue-600 hover:underline">
                  로그인하기
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container py-12">
        <div className={styles.cartGrid}>
          <div>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.cartItemIdx} className="flex items-center justify-between p-4 border-b">
                  <div className={styles.cartItemProduct}>
                    <div className={styles.cartItemImage}>
                      <Image
                        src={item.image || "/placeholder.svg?height=100&width=100"}
                        alt={item.productName}
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <h3 className={styles.cartItemName}>{item.productName}</h3>
                      <p className={styles.cartItemCategory}>상품</p>
                      <p className="text-sm text-gray-500">재고: {stockQuantities[item.productIdx]}개</p>
                    </div>
                  </div>
                  <div className={styles.cartItemPrice}>{item.price.toLocaleString()}원</div>
                  <div className={styles.cartItemQuantity}>
                    <button
                      onClick={() => updateQuantity(item.cartItemIdx, item.quantity - 1)}
                      className={styles.quantityButton}
                      aria-label="수량 감소"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="text" 
                      className={styles.quantityInput} 
                      value={item.quantity} 
                      readOnly 
                    />
                    <button
                      onClick={() => updateQuantity(item.cartItemIdx, item.quantity + 1)}
                      className={styles.quantityButton}
                      aria-label="수량 증가"
                      disabled={item.quantity >= stockQuantities[item.productIdx]}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className={styles.cartItemTotal}>
                    {(item.subtotal || item.price * item.quantity).toLocaleString()}원
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemIdx)}
                    className={styles.cartItemRemove}
                    aria-label="상품 삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>주문 요약</h2>
            <div className={styles.summaryRow}>
              <span>상품 금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span>배송비</span>
              <span>무료</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>총 결제 금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <Link href="/checkout" className={styles.checkoutButton}>
              결제하기
            </Link>
            <Link href="/store" className={styles.continueShoppingButton}>
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

