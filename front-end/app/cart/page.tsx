"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import styles from "./cart.module.css"

export default function Cart() {
  const [mounted, setMounted] = useState(false)
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()

  // 클라이언트 사이드에서만 실행되도록 처리
  useEffect(() => {
    setMounted(true)
  }, [])

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!mounted) {
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
          <h1>장바구니</h1>
          <p>{cartItems.length}개의 상품이 장바구니에 있습니다.</p>
        </div>
      </div>

      <div className="container py-12">
        <div className={styles.cartGrid}>
          <div>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemProduct}>
                    <div className={styles.cartItemImage}>
                      <Image
                        src={item.image || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <h3 className={styles.cartItemName}>{item.name}</h3>
                      <p className={styles.cartItemCategory}>상품</p>
                    </div>
                  </div>
                  <div className={styles.cartItemPrice}>{item.price.toLocaleString()}원</div>
                  <div className={styles.cartItemQuantity}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                      aria-label="수량 감소"
                    >
                      <Minus size={16} />
                    </button>
                    <input type="text" className={styles.quantityInput} value={item.quantity} readOnly />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                      aria-label="수량 증가"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className={styles.cartItemTotal}>{(item.price * item.quantity).toLocaleString()}원</div>
                  <button
                    onClick={() => removeFromCart(item.id)}
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
              <span>{getCartTotal().toLocaleString()}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span>배송비</span>
              <span>무료</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>총 결제 금액</span>
              <span>{getCartTotal().toLocaleString()}원</span>
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

