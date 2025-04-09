"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import styles from "./checkout.module.css"

export default function Checkout() {
  const router = useRouter()
  const { items: cartItems, totalPrice, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    addressDetail: "",
    postcode: "",
    memo: ""
  })

  // 클라이언트 사이드에서만 실행되도록 처리
  useEffect(() => {
    setMounted(true)
  }, [])

  // 클라이언트 컴포넌트 로직
  const { getCartTotal } = useCart()

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!mounted) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">결제 페이지 로딩 중...</h2>
        <p className="mb-6">잠시만 기다려주세요.</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    router.push("/cart")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // 주문 생성 API 호출
      const token = localStorage.getItem("token")
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingInfo: {
          ...formData,
          paymentMethod
        }
      }

      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error("주문 처리 중 오류가 발생했습니다.")
      }

      const data = await response.json()
      clearCart()
      router.push(`/orders/${data.orderId}`)
    } catch (error) {
      alert("주문 처리 중 오류가 발생했습니다.")
      setIsProcessing(false)
    }
  }

  const subtotal = totalPrice
  const discount = Math.round(subtotal * 0.02) // 2% 할인
  const total = subtotal - discount

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>결제하기</h1>
          <p>주문 정보를 입력하고 결제를 완료하세요.</p>
        </div>
      </div>

      <section className={styles.checkoutSection}>
        <div className="container">
          <div className={styles.checkoutGrid}>
            <div className={styles.checkoutForm}>
              <h2 className={styles.formTitle}>주문 정보</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">이름</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">전화번호</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">이메일</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">주소</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded mb-2"
                      />
                      <input
                        type="text"
                        name="addressDetail"
                        value={formData.addressDetail}
                        onChange={handleInputChange}
                        placeholder="상세주소"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">우편번호</label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">배송 메모</label>
                      <textarea
                        name="memo"
                        value={formData.memo}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">결제 수단</h2>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      신용카드
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="transfer"
                        checked={paymentMethod === "transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      계좌이체
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isProcessing ? "처리 중..." : "결제하기"}
                </button>
              </form>
            </div>

            <div className={styles.orderSummary}>
              <h2 className={styles.orderSummaryTitle}>주문 요약</h2>

              <div className={styles.orderItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.orderItemDetails}>
                      <div className={styles.orderItemName}>{item.name}</div>
                      <div className={styles.orderItemMeta}>수량: {item.quantity}</div>
                    </div>
                    <div className={styles.orderItemPrice}>{(item.price * item.quantity).toLocaleString()}원</div>
                  </div>
                ))}
              </div>

              <div className={styles.orderSummaryRow}>
                <span className={styles.orderSummaryLabel}>소계</span>
                <span className={styles.orderSummaryValue}>{subtotal.toLocaleString()}원</span>
              </div>

              <div className={styles.orderSummaryRow}>
                <span className={styles.orderSummaryLabel}>회원 등급 할인 (2%)</span>
                <span className={styles.orderSummaryDiscount}>-{discount.toLocaleString()}원</span>
              </div>

              <div className={styles.orderTotal}>
                <span className={styles.orderTotalLabel}>총 결제 금액</span>
                <span className={styles.orderTotalValue}>{total.toLocaleString()}원</span>
              </div>

              <Link href="/cart" className={styles.continueShoppingButton}>
                <ChevronLeft size={16} />
                장바구니로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

