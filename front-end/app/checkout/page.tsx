"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import styles from "./checkout.module.css"

export default function Checkout() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "대한민국",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
    agreeTerms: false,
    expiryMonth: "",
    expiryYear: "",
  })

  // 클라이언트 사이드에서만 실행되도록 처리
  useEffect(() => {
    setMounted(true)
  }, [])

  // 클라이언트 컴포넌트 로직
  const { cartItems, getCartTotal, clearCart } = useCart()

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!mounted) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">결제 페이지 로딩 중...</h2>
        <p className="mb-6">잠시만 기다려주세요.</p>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? e.target.checked : false

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.agreeTerms) {
      alert("주문 약관에 동의해주세요.")
      return
    }

    // 주문 처리 로직
    alert("주문이 성공적으로 완료되었습니다!")
    clearCart()
    router.push("/")
  }

  const subtotal = getCartTotal()
  const discount = Math.round(subtotal * 0.02) // 2% 할인
  const total = subtotal - discount

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h2>
        <p className="mb-6">결제를 진행하기 전에 상품을 장바구니에 담아주세요.</p>
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
          <h1>결제하기</h1>
          <p>주문 정보를 입력하고 결제를 완료하세요.</p>
        </div>
      </div>

      <section className={styles.checkoutSection}>
        <div className="container">
          <div className={styles.checkoutGrid}>
            <div className={styles.checkoutForm}>
              <h2 className={styles.formTitle}>주문 정보</h2>

              <form onSubmit={handleSubmit}>
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>배송 정보</h3>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName" className={styles.formLabel}>
                        성
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={styles.formInput}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="firstName" className={styles.formLabel}>
                        이름
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={styles.formInput}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={styles.formInput}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>
                      연락처
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={styles.formInput}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <p className="text-blue-700 text-sm">
                      <strong>안내:</strong> 배송지 정보는 주문 완료 후 안내 전화를 통해 확인됩니다.
                    </p>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>결제 정보</h3>

                  <div className={styles.formGroup}>
                    <label htmlFor="cardNumber" className={styles.formLabel}>
                      카드 번호
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className={styles.formInput}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="0000-0000-0000-0000"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="cardName" className={styles.formLabel}>
                      카드 소유자 이름
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      className={styles.formInput}
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="카드에 표시된 이름"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>만료일</label>
                    <div className={styles.formGrid}>
                      <div>
                        <select
                          id="expiryMonth"
                          name="expiryMonth"
                          className={styles.formInput}
                          value={formData.expiryMonth}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">월</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0")
                            return (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                      <div>
                        <select
                          id="expiryYear"
                          name="expiryYear"
                          className={styles.formInput}
                          value={formData.expiryYear}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">년</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString()
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.formCheckboxContainer}>
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    className={styles.formCheckbox}
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="agreeTerms" className="text-sm">
                    주문 내용을 확인하였으며, 개인정보 수집 및 이용에 동의합니다.
                  </label>
                </div>

                <button type="submit" className={`button button-primary ${styles.placeOrderButton}`}>
                  결제하기
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

