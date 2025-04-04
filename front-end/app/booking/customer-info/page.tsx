"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import styles from "../../rooms/rooms.module.css"

export default function CustomerInfo() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    emailId: "",
    emailDomain: "",
    emailDomainSelect: "direct",
    phone: "",
    cardNumber: "",
    cardExpiry: "",
    agreeTerms: false,
  })

  // 로그인 상태 확인
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const email = localStorage.getItem("userEmail") || ""

    setIsLoggedIn(loggedIn)
    setUserEmail(email)

    if (loggedIn && email) {
      // 로그인한 사용자의 정보를 불러오는 로직 (실제로는 API 호출 등이 필요)
      setFormData((prev) => ({
        ...prev,
        lastName: "김",
        firstName: "철수",
        emailId: email.split("@")[0],
        emailDomain: email.split("@")[1],
        phone: "010-1234-5678",
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    if (name === "emailDomainSelect") {
      if (value === "direct") {
        setFormData((prev) => ({ ...prev, [name]: value }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: value, emailDomain: value }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeTerms) {
      alert("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    // 예약 정보에 고객 정보 추가
    const bookingInfo = JSON.parse(localStorage.getItem("bookingInfo") || "{}")
    const customerInfo = {
      lastName: formData.lastName,
      firstName: formData.firstName,
      email: `${formData.emailId}@${formData.emailDomain}`,
      phone: formData.phone,
      payment: {
        cardNumber: formData.cardNumber,
        cardExpiry: formData.cardExpiry,
      },
    }

    bookingInfo.customer = customerInfo
    localStorage.setItem("bookingInfo", JSON.stringify(bookingInfo))

    // 예약 완료 페이지로 이동
    router.push("/booking/complete")
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>고객 정보 입력</h1>
          <p>예약을 완료하기 위한 정보를 입력해주세요.</p>
        </div>
      </div>

      <section className={styles.customerInfoSection}>
        <div className="container">
          <div className={styles.bookingSteps}>
            <div className={`${styles.bookingStep} ${styles.bookingStepCompleted}`}>
              <div className={styles.bookingStepNumber}>
                <Check size={16} />
              </div>
              <div className={styles.bookingStepLabel}>객실 선택</div>
            </div>
            <div className={`${styles.bookingStep} ${styles.bookingStepCompleted}`}>
              <div className={styles.bookingStepNumber}>
                <Check size={16} />
              </div>
              <div className={styles.bookingStepLabel}>옵션 선택</div>
            </div>
            <div className={`${styles.bookingStep} ${styles.bookingStepActive}`}>
              <div className={styles.bookingStepNumber}>3</div>
              <div className={styles.bookingStepLabel}>정보 입력</div>
            </div>
            <div className={styles.bookingStep}>
              <div className={styles.bookingStepNumber}>4</div>
              <div className={styles.bookingStepLabel}>예약 완료</div>
            </div>
          </div>

          <div className={styles.customerInfoGrid}>
            <form className={styles.customerInfoForm} onSubmit={handleSubmit}>
              <h2 className={styles.customerInfoTitle}>예약자 정보</h2>

              {isLoggedIn && (
                <div className="bg-gray-50 p-4 rounded mb-6">
                  <p className="text-sm">
                    <strong>{userEmail}</strong> 계정으로 로그인되었습니다.
                  </p>
                </div>
              )}

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>고객 정보</h3>

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
                  <label htmlFor="emailId" className={styles.formLabel}>
                    이메일
                  </label>
                  <div className={styles.emailGroup}>
                    <input
                      type="text"
                      id="emailId"
                      name="emailId"
                      className={styles.formInput}
                      value={formData.emailId}
                      onChange={handleInputChange}
                      required
                    />
                    <span className={styles.emailAt}>@</span>
                    <input
                      type="text"
                      id="emailDomain"
                      name="emailDomain"
                      className={styles.formInput}
                      value={formData.emailDomain}
                      onChange={handleInputChange}
                      disabled={formData.emailDomainSelect !== "direct"}
                      required
                    />
                  </div>
                  <select
                    name="emailDomainSelect"
                    className={`${styles.formSelect} mt-2`}
                    value={formData.emailDomainSelect}
                    onChange={handleInputChange}
                  >
                    <option value="direct">직접 입력</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="hotmail.com">hotmail.com</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>
                    전화번호
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.formInput}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                    required
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>결제 정보</h3>

                <div className={styles.formGrid}>
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
                    <label htmlFor="cardExpiry" className={styles.formLabel}>
                      유효 기간 (MM/YY)
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      className={styles.formInput}
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>환불 및 취소 규정</h3>

                <div className="bg-gray-50 p-4 rounded mb-4">
                  <ul className="list-disc pl-5 text-sm">
                    <li className="mb-2">체크인 7일 전까지: 전액 환불</li>
                    <li className="mb-2">체크인 3-6일 전: 객실 요금의 30% 취소 수수료 부과</li>
                    <li className="mb-2">체크인 1-2일 전: 객실 요금의 50% 취소 수수료 부과</li>
                    <li>체크인 당일 및 No-show: 환불 불가</li>
                  </ul>
                </div>

                <h3 className={styles.formSectionTitle}>유의사항</h3>

                <div className="bg-gray-50 p-4 rounded mb-4">
                  <ul className="list-disc pl-5 text-sm">
                    <li className="mb-2">체크인: 15:00 / 체크아웃: 11:00</li>
                    <li className="mb-2">전 객실 금연입니다.</li>
                    <li className="mb-2">객실 내 취사는 불가합니다.</li>
                    <li>반려동물 동반 투숙은 불가합니다. (안내견 제외)</li>
                  </ul>
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
                <label htmlFor="agreeTerms">
                  개인정보 수집 및 이용에 동의합니다. (필수)
                  <span className={styles.termsLink} onClick={() => setTermsModalOpen(true)}>
                    [자세히]
                  </span>
                </label>
              </div>

              <button type="submit" className={`button button-primary ${styles.placeOrderButton}`}>
                예약 완료
              </button>
            </form>

            <div className={styles.orderSummary}>
              <h2 className={styles.orderSummaryTitle}>예약 요약</h2>

              {/* 예약 정보 요약 (실제로는 localStorage에서 가져온 데이터 사용) */}
              <div className={styles.orderItems}>
                <div className={styles.orderItem}>
                  <div className={styles.orderItemDetails}>
                    <div className={styles.orderItemName}>Chill Comfort</div>
                    <div className={styles.orderItemMeta}>킹 베드, 시티 뷰</div>
                  </div>
                  <div className={styles.orderItemPrice}>₩250,000</div>
                </div>

                <div className={styles.orderItem}>
                  <div className={styles.orderItemDetails}>
                    <div className={styles.orderItemName}>성인 조식</div>
                    <div className={styles.orderItemMeta}>2명</div>
                  </div>
                  <div className={styles.orderItemPrice}>₩70,000</div>
                </div>
              </div>

              <div className={styles.orderSummaryRow}>
                <span className={styles.orderSummaryLabel}>소계</span>
                <span className={styles.orderSummaryValue}>₩320,000</span>
              </div>

              <div className={styles.orderSummaryRow}>
                <span className={styles.orderSummaryLabel}>회원 등급 할인 (2%)</span>
                <span className={styles.orderSummaryDiscount}>-₩6,400</span>
              </div>

              <div className={styles.orderTotal}>
                <span className={styles.orderTotalLabel}>총 결제 금액</span>
                <span className={styles.orderTotalValue}>₩313,600</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {termsModalOpen && (
        <div className={styles.termsModal} onClick={() => setTermsModalOpen(false)}>
          <div className={styles.termsModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.termsModalClose} onClick={() => setTermsModalOpen(false)}>
              <X size={24} />
            </button>

            <h3 className={styles.termsModalTitle}>개인정보 수집 및 이용 동의</h3>

            <div>
              <p>럭스 호텔은 예약 서비스 제공을 위해 다음과 같이 개인정보를 수집 및 이용합니다.</p>

              <p className="mt-4 font-semibold">1. 수집항목</p>
              <p>- 필수항목: 성명, 이메일 주소, 연락처, 결제 정보</p>
              <p>- 선택항목: 특별 요청사항</p>

              <p className="mt-4 font-semibold">2. 수집 및 이용목적</p>
              <p>- 객실 예약 및 서비스 제공</p>
              <p>- 예약 확인 및 취소 안내</p>
              <p>- 결제 및 환불 처리</p>
              <p>- 서비스 관련 고지사항 전달</p>

              <p className="mt-4 font-semibold">3. 보유 및 이용기간</p>
              <p>- 예약 정보: 체크아웃 후 5년</p>
              <p>- 결제 정보: 관련 법령에 따른 보존기간</p>

              <p className="mt-4">
                귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 동의 거부 시 객실 예약 서비스 이용이
                제한됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

