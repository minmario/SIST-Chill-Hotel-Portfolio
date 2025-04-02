"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import styles from "@/app/membership/membership.module.css"

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

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!mounted) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">결제 페이지 로딩 중...</h2>
        <p className="mb-6">잠시만 기다려주세요.</p>
      </div>
    )
  }

  // 클라이언트 컴포넌트 로직
  const { cartItems, getCartTotal, clearCart } = useCart()

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
      <div className={styles.header || "bg-gray-100 py-12 text-center"}>
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">결제하기</h1>
          <p>주문 정보를 입력하고 결제를 완료하세요.</p>
        </div>
      </div>

      <section className={styles.checkoutSection || "py-12"}>
        <div className="container">
          <div className={styles.checkoutGrid || "grid grid-cols-1 lg:grid-cols-3 gap-8"}>
            <div className={styles.checkoutForm || "lg:col-span-2"}>
              <h2 className={styles.formTitle || "text-2xl font-bold mb-6"}>주문 정보</h2>

              <form onSubmit={handleSubmit}>
                <div className={styles.formSection || "mb-8 p-6 bg-white rounded-lg shadow-sm"}>
                  <h3 className={styles.formSectionTitle || "text-xl font-semibold mb-4"}>배송 정보</h3>

                  <div className={styles.formGrid || "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                    <div className={styles.formGroup || "mb-4"}>
                      <label htmlFor="lastName" className={styles.formLabel || "block mb-2 font-medium"}>
                        성
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={styles.formInput || "w-full p-3 border border-gray-300 rounded-md"}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup || "mb-4"}>
                      <label htmlFor="firstName" className={styles.formLabel || "block mb-2 font-medium"}>
                        이름
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={styles.formInput || "w-full p-3 border border-gray-300 rounded-md"}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup || "mb-4"}>
                    <label htmlFor="email" className={styles.formLabel || "block mb-2 font-medium"}>
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={styles.formInput || "w-full p-3 border border-gray-300 rounded-md"}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup || "mb-4"}>
                    <label htmlFor="phone" className={styles.formLabel || "block mb-2 font-medium"}>
                      연락처
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={styles.formInput || "w-full p-3 border border-gray-300 rounded-md"}
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

                <div className={styles.formSection || "mb-8 p-6 bg-white rounded-lg shadow-sm"}>
                  <h3 className={styles.formSectionTitle || "text-xl font-semibold mb-4"}>결제 정보</h3>

                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block mb-2 font-medium">
                      카드 번호
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="0000-0000-0000-0000"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="cardName" className="block mb-2 font-medium">
                      카드 소유자 이름
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="카드에 표시된 이름"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-medium">만료일</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <select
                          id="expiryMonth"
                          name="expiryMonth"
                          className="w-full p-3 border border-gray-300 rounded-md"
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
                          className="w-full p-3 border border-gray-300 rounded-md"
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

                <div className={styles.formCheckboxContainer || "mb-6 flex items-start"}>
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    className={styles.formCheckbox || "mr-2 mt-1"}
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="agreeTerms" className="text-sm">
                    주문 내용을 확인하였으며, 개인정보 수집 및 이용에 동의합니다.
                  </label>
                </div>

                <button type="submit" className={`button button-primary ${styles.placeOrderButton || "w-full py-3"}`}>
                  결제하기
                </button>
              </form>
            </div>

            <div className={styles.orderSummary || "bg-white p-6 rounded-lg shadow-sm h-fit"}>
              <h2 className={styles.orderSummaryTitle || "text-xl font-bold mb-4"}>주문 요약</h2>

              <div className={styles.orderItems || "mb-6 divide-y"}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.orderItem || "py-3 flex justify-between"}>
                    <div className={styles.orderItemDetails || ""}>
                      <div className={styles.orderItemName || "font-medium"}>{item.name}</div>
                      <div className={styles.orderItemMeta || "text-sm text-gray-500"}>수량: {item.quantity}</div>
                    </div>
                    <div className={styles.orderItemPrice || "font-medium"}>
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.orderSummaryRow || "flex justify-between py-2"}>
                <span className={styles.orderSummaryLabel || ""}>소계</span>
                <span className={styles.orderSummaryValue || "font-medium"}>{subtotal.toLocaleString()}원</span>
              </div>

              <div className={styles.orderSummaryRow || "flex justify-between py-2"}>
                <span className={styles.orderSummaryLabel || ""}>회원 등급 할인 (2%)</span>
                <span className={styles.orderSummaryDiscount || "text-green-600"}>-{discount.toLocaleString()}원</span>
              </div>

              <div className={styles.orderTotal || "flex justify-between py-3 mt-2 border-t border-gray-200"}>
                <span className={styles.orderTotalLabel || "font-bold"}>총 결제 금액</span>
                <span className={styles.orderTotalValue || "font-bold text-lg"}>{total.toLocaleString()}원</span>
              </div>

              <Link
                href="/cart"
                className={styles.continueShoppingButton || "flex items-center text-gray-600 mt-4 hover:text-gray-900"}
              >
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

