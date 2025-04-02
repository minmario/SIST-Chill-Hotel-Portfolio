"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut, Award, Gift, Plus, Edit2, Trash2, Home, Shield, Check } from "lucide-react"
import styles from "../mypage.module.css"

// 결제 수단 타입 정의
type PaymentMethod = {
  id: string
  type: string
  cardNumber: string
  cardName: string
  expiryDate: string
  isDefault: boolean
}

export default function Payment() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "삼성카드",
      cardNumber: "1231 4341 2431 4322",
      cardName: "민재홍",
      expiryDate: "11/29",
      isDefault: true,
    },
  ])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

  const [newPaymentData, setNewPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    cardType: "삼성카드",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    isDefault: false,
  })

  const [formErrors, setFormErrors] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  })

  useEffect(() => {
    // 로그인 상태 확인
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)

    if (!loggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setNewPaymentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // 입력값 변경 시 해당 필드의 에러 메시지 초기화
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const formatCardNumber = (value: string) => {
    // 카드 번호 포맷팅 (4자리마다 공백 추가)
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setNewPaymentData((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }))

    if (formErrors.cardNumber) {
      setFormErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const errors = {
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    }

    // 카드 번호 검증
    const cardNumberRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/
    if (!cardNumberRegex.test(newPaymentData.cardNumber)) {
      errors.cardNumber = "유효한 카드 번호를 입력해주세요."
      isValid = false
    }

    // 카드 소유자 이름 검증
    if (!newPaymentData.cardName.trim()) {
      errors.cardName = "카드 소유자 이름을 입력해주세요."
      isValid = false
    }

    // 유효기간 검증
    if (!newPaymentData.expiryMonth) {
      errors.expiryMonth = "만료 월을 선택해주세요."
      isValid = false
    }

    if (!newPaymentData.expiryYear) {
      errors.expiryYear = "만료 연도를 선택해주세요."
      isValid = false
    }

    // CVC 검증
    const cvcRegex = /^\d{3,4}$/
    if (!cvcRegex.test(newPaymentData.cvc)) {
      errors.cvc = "유효한 CVC 번호를 입력해주세요."
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // 새 결제 수단 추가
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentData.cardType,
      cardNumber: newPaymentData.cardNumber,
      cardName: newPaymentData.cardName,
      expiryDate: `${newPaymentData.expiryMonth}/${newPaymentData.expiryYear.slice(-2)}`,
      isDefault: newPaymentData.isDefault,
    }

    // 기본 카드로 설정한 경우 다른 카드의 기본 설정 해제
    let updatedPaymentMethods = [...paymentMethods]
    if (newPayment.isDefault) {
      updatedPaymentMethods = updatedPaymentMethods.map((method) => ({
        ...method,
        isDefault: false,
      }))
    }

    // 새 카드가 유일한 카드인 경우 기본 카드로 설정
    if (updatedPaymentMethods.length === 0) {
      newPayment.isDefault = true
    }

    setPaymentMethods([...updatedPaymentMethods, newPayment])

    // 모달 닫기 및 폼 초기화
    setIsAddModalOpen(false)
    setNewPaymentData({
      cardNumber: "",
      cardName: "",
      cardType: "삼성카드",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      isDefault: false,
    })
  }

  const handleEditPayment = (id: string) => {
    const paymentToEdit = paymentMethods.find((method) => method.id === id)
    if (!paymentToEdit) return

    setSelectedPaymentId(id)

    // 유효기간 분리
    const [expiryMonth, expiryYear] = paymentToEdit.expiryDate.split("/")

    setNewPaymentData({
      cardNumber: paymentToEdit.cardNumber,
      cardName: paymentToEdit.cardName,
      cardType: paymentToEdit.type,
      expiryMonth,
      expiryYear: `20${expiryYear}`,
      cvc: "",
      isDefault: paymentToEdit.isDefault,
    })

    setIsEditModalOpen(true)
  }

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !selectedPaymentId) {
      return
    }

    // 결제 수단 업데이트
    const updatedPaymentMethods = paymentMethods.map((method) => {
      if (method.id === selectedPaymentId) {
        return {
          ...method,
          type: newPaymentData.cardType,
          cardNumber: newPaymentData.cardNumber,
          cardName: newPaymentData.cardName,
          expiryDate: `${newPaymentData.expiryMonth}/${newPaymentData.expiryYear.slice(-2)}`,
          isDefault: newPaymentData.isDefault,
        }
      }

      // 현재 카드가 기본 카드로 설정된 경우 다른 카드의 기본 설정 해제
      if (newPaymentData.isDefault) {
        return {
          ...method,
          isDefault: method.id === selectedPaymentId,
        }
      }

      return method
    })

    setPaymentMethods(updatedPaymentMethods)

    // 모달 닫기 및 상태 초기화
    setIsEditModalOpen(false)
    setSelectedPaymentId(null)
    setNewPaymentData({
      cardNumber: "",
      cardName: "",
      cardType: "삼성카드",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      isDefault: false,
    })
  }

  const handleDeleteClick = (id: string) => {
    setSelectedPaymentId(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeletePayment = () => {
    if (!selectedPaymentId) return

    // 삭제할 결제 수단 찾기
    const paymentToDelete = paymentMethods.find((method) => method.id === selectedPaymentId)

    // 결제 수단 삭제
    let updatedPaymentMethods = paymentMethods.filter((method) => method.id !== selectedPaymentId)

    // 삭제된 카드가 기본 카드였고 다른 카드가 있는 경우 첫 번째 카드를 기본 카드로 설정
    if (paymentToDelete?.isDefault && updatedPaymentMethods.length > 0) {
      updatedPaymentMethods = [{ ...updatedPaymentMethods[0], isDefault: true }, ...updatedPaymentMethods.slice(1)]
    }

    setPaymentMethods(updatedPaymentMethods)

    // 모달 닫기 및 상태 초기화
    setIsDeleteModalOpen(false)
    setSelectedPaymentId(null)
  }

  const setDefaultPayment = (id: string) => {
    const updatedPaymentMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }))

    setPaymentMethods(updatedPaymentMethods)
  }

  if (!isLoggedIn) {
    return null // 로그인 페이지로 리디렉션 중
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>결제관리</h1>
          <p>결제 수단을 관리하고 안전하게 보관하세요.</p>
        </div>
      </div>

      <section className={styles.mypageSection}>
        <div className="container">
          {/* 브레드크럼 네비게이션 */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="flex items-center hover:text-primary-color transition-colors">
              <Home size={14} className="mr-1" />홈
            </Link>
            <span className="mx-2">›</span>
            <Link href="/mypage" className="hover:text-primary-color transition-colors">
              마이페이지
            </Link>
            <span className="mx-2">›</span>
            <span className="text-primary-color" style={{ color: "var(--primary-color)" }}>
              결제관리
            </span>
          </div>

          <div className={styles.mypageContainer}>
            {/* 사이드바 */}
            <div className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>
                <User size={20} className={styles.sidebarIcon} />
                마이페이지
              </h2>

              <ul className={styles.sidebarNav}>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage" className={styles.sidebarNavLink}>
                    <Award size={18} />
                    Chill Haven 등급 및 포인트
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/points" className={styles.sidebarNavLink}>
                    <Gift size={18} />
                    포인트 적립 내역 및 조회
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/info" className={styles.sidebarNavLink}>
                    <User size={18} />
                    마이페이지 정보 수정
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/withdraw" className={styles.sidebarNavLink}>
                    <LogOut size={18} />
                    회원 탈퇴
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/payment" className={`${styles.sidebarNavLink} ${styles.sidebarNavLinkActive}`}>
                    <CreditCard size={18} />
                    결제관리
                  </Link>
                </li>
              </ul>

              <div className={styles.customerService}>
                <h3 className={styles.customerServiceTitle}>고객 지원</h3>
                <p className={styles.customerServiceHours}>평일 09:00 - 18:00</p>
                <p className={styles.customerServicePhone}>1588-1234</p>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className={styles.contentArea}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">결제관리</h3>
                <button
                  className="flex items-center px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors"
                  style={{ backgroundColor: "var(--primary-color)" }}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={18} className="mr-2" />
                  결제 수단 추가
                </button>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4">저장된 결제 수단</h4>
                <p className="text-gray-600 mb-4">
                  등록된 결제 수단을 관리하세요. 기본 결제 수단은 예약 시 자동으로 선택됩니다.
                </p>

                {paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {paymentMethods.map((payment) => (
                      <div
                        key={payment.id}
                        className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                      >
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="bg-black text-white text-xs font-bold px-3 py-1 rounded mr-4">
                            {payment.type === "삼성카드" ? "삼성" : payment.type}
                          </div>
                          <div>
                            <div className="font-medium">{payment.cardNumber}</div>
                            <div className="text-sm text-gray-500">만료일: {payment.expiryDate}</div>
                            <div className="text-sm text-gray-500">
                              {payment.cardName} • {payment.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {payment.isDefault ? (
                            <span
                              className="text-sm text-primary-color flex items-center"
                              style={{ color: "var(--primary-color)" }}
                            >
                              <Check size={16} className="mr-1" /> 기본
                            </span>
                          ) : (
                            <button
                              className="text-sm text-gray-500 hover:text-primary-color transition-colors"
                              onClick={() => setDefaultPayment(payment.id)}
                            >
                              기본으로 설정
                            </button>
                          )}
                          <button
                            className="text-gray-500 hover:text-primary-color transition-colors"
                            onClick={() => handleEditPayment(payment.id)}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            onClick={() => handleDeleteClick(payment.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <CreditCard size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-4">등록된 결제 수단이 없습니다.</p>
                    <button
                      className="px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors"
                      style={{ backgroundColor: "var(--primary-color)" }}
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      결제 수단 추가하기
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                <Shield size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-700 font-medium mb-1">안전한 결제</p>
                  <p className="text-blue-600 text-sm">
                    결제 정보는 암호화되어 안전하게 저장됩니다. 전체 카드 정보는 서버에 저장되지 않으며, 모든 거래는
                    보안 게이트웨이를 통해 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 결제 수단 추가 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">결제 수단 추가</h3>

            <form onSubmit={handleAddPayment}>
              <div className="mb-4">
                <label htmlFor="cardType" className="block mb-2 font-medium">
                  카드 종류
                </label>
                <select
                  id="cardType"
                  name="cardType"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={newPaymentData.cardType}
                  onChange={handleInputChange}
                >
                  <option value="삼성카드">삼성카드</option>
                  <option value="신한카드">신한카드</option>
                  <option value="현대카드">현대카드</option>
                  <option value="KB국민카드">KB국민카드</option>
                  <option value="롯데카드">롯데카드</option>
                  <option value="BC카드">BC카드</option>
                  <option value="하나카드">하나카드</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="cardNumber" className="block mb-2 font-medium">
                  카드 번호
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  className={`w-full p-3 border ${formErrors.cardNumber ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={newPaymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
                {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="cardName" className="block mb-2 font-medium">
                  카드 소유자 이름
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  className={`w-full p-3 border ${formErrors.cardName ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={newPaymentData.cardName}
                  onChange={handleInputChange}
                  placeholder="카드에 표시된 이름"
                  required
                />
                {formErrors.cardName && <p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">만료일</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      className={`w-full p-3 border ${formErrors.expiryMonth ? "border-red-500" : "border-gray-300"} rounded-md`}
                      value={newPaymentData.expiryMonth}
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
                    {formErrors.expiryMonth && <p className="text-red-500 text-sm mt-1">{formErrors.expiryMonth}</p>}
                  </div>
                  <div>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      className={`w-full p-3 border ${formErrors.expiryYear ? "border-red-500" : "border-gray-300"} rounded-md`}
                      value={newPaymentData.expiryYear}
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
                    {formErrors.expiryYear && <p className="text-red-500 text-sm mt-1">{formErrors.expiryYear}</p>}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="cvc" className="block mb-2 font-medium">
                  CVC/CVV
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  className={`w-full p-3 border ${formErrors.cvc ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={newPaymentData.cvc}
                  onChange={handleInputChange}
                  placeholder="카드 뒷면 3자리 또는 4자리 숫자"
                  maxLength={4}
                  required
                />
                {formErrors.cvc && <p className="text-red-500 text-sm mt-1">{formErrors.cvc}</p>}
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    className="w-4 h-4 mr-2"
                    checked={newPaymentData.isDefault}
                    onChange={handleInputChange}
                  />
                  <span>기본 결제 수단으로 설정</span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 결제 수단 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">결제 수단 수정</h3>

            <form onSubmit={handleUpdatePayment}>
              <div className="mb-4">
                <label htmlFor="cardType" className="block mb-2 font-medium">
                  카드 종류
                </label>
                <select
                  id="cardType"
                  name="cardType"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={newPaymentData.cardType}
                  onChange={handleInputChange}
                >
                  <option value="삼성카드">삼성카드</option>
                  <option value="신한카드">신한카드</option>
                  <option value="현대카드">현대카드</option>
                  <option value="KB국민카드">KB국민카드</option>
                  <option value="롯데카드">롯데카드</option>
                  <option value="BC카드">BC카드</option>
                  <option value="하나카드">하나카드</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="cardNumber" className="block mb-2 font-medium">
                  카드 번호
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  className={`w-full p-3 border ${formErrors.cardNumber ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={newPaymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
                {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="cardName" className="block mb-2 font-medium">
                  카드 소유자 이름
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  className={`w-full p-3 border ${formErrors.cardName ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={newPaymentData.cardName}
                  onChange={handleInputChange}
                  placeholder="카드에 표시된 이름"
                  required
                />
                {formErrors.cardName && <p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">만료일</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      className={`w-full p-3 border ${formErrors.expiryMonth ? "border-red-500" : "border-gray-300"} rounded-md`}
                      value={newPaymentData.expiryMonth}
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
                    {formErrors.expiryMonth && <p className="text-red-500 text-sm mt-1">{formErrors.expiryMonth}</p>}
                  </div>
                  <div>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      className={`w-full p-3 border ${formErrors.expiryYear ? "border-red-500" : "border-gray-300"} rounded-md`}
                      value={newPaymentData.expiryYear}
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
                    {formErrors.expiryYear && <p className="text-red-500 text-sm mt-1">{formErrors.expiryYear}</p>}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="cvc" className="block mb-2 font-medium">
                  CVC/CVV
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  className={`w-full p-3 border ${formErrors.cvc ? "border-red-500" : "border-gray-300"} rounded-md`}
                  value={newPaymentData.cvc}
                  onChange={handleInputChange}
                  placeholder="카드 뒷면 3자리 또는 4자리 숫자"
                  maxLength={4}
                  required
                />
                {formErrors.cvc && <p className="text-red-500 text-sm mt-1">{formErrors.cvc}</p>}
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    className="w-4 h-4 mr-2"
                    checked={newPaymentData.isDefault}
                    onChange={handleInputChange}
                  />
                  <span>기본 결제 수단으로 설정</span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  수정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 결제 수단 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">결제 수단 삭제</h3>
            <p className="text-gray-700 mb-6">정말로 이 결제 수단을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={handleDeletePayment}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

