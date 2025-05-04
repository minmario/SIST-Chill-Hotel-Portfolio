"use client"
export const dynamic = 'force-dynamic'
import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import styles from "../../rooms/rooms.module.css"

export default function CustomerInfo() {
  // 디버깅용: user 데이터 상태
  const [debugUser, setDebugUser] = useState<any>(null);
  type RoomType = {
    roomTypesIdx: number;
    roomName: string;
    grade: string;
    size: number;
    viewType: string;
    maxPeople: number;
    description: string;
    weekPrice: number;
    weekendPrice: number;
    peakWeekPrice: number;
    peakWeekendPrice: number;
    totalCount: number;
    availableCount: number;
    roomImage: string;
    availableRooms: {
      roomIdx: number;
      roomNum: string;
      floor: number;
    }[];
  };

  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [bookingInfo, setBookingInfo] = useState<any>(null)
  const [mounted, setMounted] = useState(false) // SSR 오류 방지용
  const [accessToken,setAccessToken] = useState("")

  // 회원 등급 할인율 계산 함수
  function getMemberDiscountPercent(idx: number | null | undefined) {
    switch (idx) {
      case 1: return 3;
      case 2: return 5;
      case 3: return 7;
      case 4: return 10;
      default: return 0;
    }
  }

  // 예약 요약에 쓸 할인/총액 계산
  let memberDiscountPercent = 0;
  let memberLabel = "회원 등급 할인";
  let priceInfo = bookingInfo?.pricing;
  if (bookingInfo && bookingInfo.specialOffer && bookingInfo.specialOffer.price) {
    // 오퍼가 + 조식 가격을 합산
    const offerPrice = Number(bookingInfo.specialOffer.price);
    const adultBreakfastPrice = bookingInfo.pricing?.adultBreakfastPrice || 0;
    const childBreakfastPrice = bookingInfo.pricing?.childBreakfastPrice || 0;
    const totalBreakfast = adultBreakfastPrice + childBreakfastPrice;
    const subtotal = offerPrice + totalBreakfast;
    if (typeof bookingInfo.membership_idx === 'number') {
      memberDiscountPercent = getMemberDiscountPercent(bookingInfo.membership_idx);
      memberLabel = `회원 등급 할인 (${memberDiscountPercent}%)`;
      const discount = Math.round(subtotal * (memberDiscountPercent / 100));
      priceInfo = {
        ...priceInfo,
        roomPrice: offerPrice,
        subtotal,
        discount,
        total: subtotal - discount
      }
    } else {
      // 비회원: 할인 없음
      priceInfo = {
        ...priceInfo,
        roomPrice: offerPrice,
        subtotal,
        discount: 0,
        total: subtotal
      }
    }
  } else if (bookingInfo && typeof bookingInfo.membership_idx === 'number') {
    memberDiscountPercent = getMemberDiscountPercent(bookingInfo.membership_idx);
    memberLabel = `회원 등급 할인 (${memberDiscountPercent}%)`;
    if (priceInfo) {
      // 일반 객실 예약 할인 계산
      const discount = Math.round(priceInfo.subtotal * (memberDiscountPercent / 100));
      priceInfo = {
        ...priceInfo,
        discount,
        total: priceInfo.subtotal - discount
      }
    }
  } else if (bookingInfo && priceInfo) {
    // 비회원: 할인 0원
    priceInfo = {
      ...priceInfo,
      discount: 0,
      total: priceInfo.subtotal
    }
  }

  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);


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
    if (typeof window === "undefined") return
    
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const email = localStorage.getItem("userEmail") || ""
    const booking = localStorage.getItem("bookingInfo")

    setIsLoggedIn(loggedIn)
    setUserEmail(email)
    
    if (loggedIn) {
      setAccessToken(localStorage.getItem('accessToken') || "")
      let userName = null;
      if (accessToken) {
        try {
          // jwt.ts에서 userName 추출 함수 import 필요
          // import { extractUserNameFromToken } from "../info/jwt";
          // 동적 import (최상단 import로 이동 권장)
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { extractSubFromToken } = require("../info/jwt");
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          userName = extractSubFromToken(accessToken);
        } catch { }
      }
      if (accessToken && userName) {
        fetch(`/api/user/find_user?userId=${encodeURIComponent(userName)}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(res => res.ok ? res.json() : Promise.reject())
          .then(user => {
            setDebugUser(user);
            setFormData((prev) => ({
              ...prev,
              lastName: user.lastName ?? "",
              firstName: user.firstName ?? "",
              emailId: user.email ? user.email.split("@")[0] : user.id ?? "",
              emailDomain: user.email ? user.email.split("@")[1] : "",
              phone: user.phone ?? "",
              cardNumber: "",
              cardExpiry: ""
            }))
            setUserEmail(userName);
          })
          .catch(() => {
            setFormData((prev) => ({
              ...prev,
              lastName: "",
              firstName: "",
              emailId: userName || "",
              emailDomain: "",
              phone: "",
              cardNumber: "",
              cardExpiry: ""
            }))
            setUserEmail(userName || "");
          });
      } else {
        setFormData((prev) => ({
          ...prev,
          lastName: "",
          firstName: "",
          emailId: email.split("@")[0],
          emailDomain: email.split("@")[1],
          phone: "",
          cardNumber: "",
          cardExpiry: ""
        }))
        setUserEmail(email);
      }
    }
    if (booking) {
      setBookingInfo(JSON.parse(booking))
    }
    setMounted(true) // 컴포넌트가 마운트 되었음을 표시
  }, [])




  const handleSelectRoomType = (roomType: RoomType) => {
    setSelectedRoomType(roomType);
    setSelectedRoomIdx(roomType.availableRooms[0]?.roomIdx || null);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeTerms) {
      alert("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    // 예약 정보에 고객 정보 추가
    const customerInfo = {
      lastName: formData.lastName,
      firstName: formData.firstName,
      email: `${formData.emailId}@${formData.emailDomain}`,
      phone: formData.phone,
      cardNumber: formData.cardNumber,
      cardExpiry: formData.cardExpiry,
    }

    const raw = localStorage.getItem("bookingInfo")
    if (!raw) {
      alert("예약 정보가 없습니다.")
      return
    }

    const baseBooking = JSON.parse(raw)
    // specialOffer가 있으면 offer_id 추가
    let offer_id = undefined;
    if (baseBooking.specialOffer && typeof baseBooking.specialOffer.id !== 'undefined') {
      offer_id = baseBooking.specialOffer.id;
    }
    const bookingInfo = {
      userIdx: isLoggedIn ? 1 : null, // 실제 로그인 사용자 idx로 교체 필요
      roomIdxList: baseBooking.roomIdx,
      roomTypesIdx: baseBooking.roomTypesIdx,
      checkIn: baseBooking?.params?.checkIn, // 
      checkOut: baseBooking?.params?.checkOut,
      roomCount: parseInt(baseBooking.params.roomCount),
      adultCount: parseInt(baseBooking.params.adults),
      childCount: parseInt(baseBooking.params.children),
      bedType: baseBooking.options.bedType,
      specialRequests: baseBooking.options.specialRequests || "",

      roomPrice: priceInfo.roomPrice,
      adultBreakfastPrice: priceInfo.adultBreakfastPrice,
      childBreakfastPrice: priceInfo.childBreakfastPrice,
      subtotal: priceInfo.subtotal,
      discount: priceInfo.discount,
      total: priceInfo.total,

      firstName: formData.firstName,
      lastName: formData.lastName,
      email: `${formData.emailId}@${formData.emailDomain}`,
      phone: formData.phone,
      cardNumber: formData.cardNumber,
      cardExpiry: formData.cardExpiry,
      room: baseBooking.room,// room 객체 전체 추가!
      ...(offer_id !== undefined ? { offerId: offer_id } : {})
    }
    try {
      console.log("예약 정보:", bookingInfo);
      console.log("bookingInfo.roomIdx: ",bookingInfo.roomIdxList)
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : ""
        },
        body: JSON.stringify(bookingInfo),
      });

      if (!res.ok) throw new Error("예약 실패")

      const result = await res.json()
      console.log("예약 완료:", result)
      // 예약번호를 bookingInfo에 저장 (reservationNum이 응답에 포함된다는 전제)
      localStorage.setItem("bookingInfo", JSON.stringify({
        ...bookingInfo,
        reservationNum: result.reservationNum,
        specialOffer: baseBooking.specialOffer // specialOffer 정보도 함께 저장
      }))
      router.push("/booking/complete")
    } catch (err) {
      console.error("예약 중 오류:", err)
      alert("예약 처리 중 오류가 발생했습니다.")
    }
  }
  const safe = (value: any) => (typeof value === "number" ? value.toLocaleString() : "-")

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
                    <strong>{userEmail}</strong>님(회원)으로 로그인되었습니다.
                  </p>
                </div>
              )}

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>고객 정보</h3>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.formLabel}>
                      성
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

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.formLabel}>
                      이름
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
                      value={formData.emailDomain ?? ""}
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

            <div className={styles.customerInfoGrid}>
              {/* 예약 요약 */}
              {bookingInfo && (
                <aside className="border rounded p-5 bg-white shadow-sm" style={{ flex: 1, height: "50%" }}>
                  <h2 className="text-lg font-bold mb-4">예약 요약</h2>
                  <ul className="space-y-4">
                    {bookingInfo.specialOffer && bookingInfo.specialOffer.price ? (
                      <li className="flex justify-between">
                        <div>
                          <div className="font-medium">{bookingInfo.specialOffer.title}</div>
                          <div className="text-sm text-gray-500">{bookingInfo.specialOffer.subtitle}</div>
                        </div>
                        <div className="font-medium">₩{safe(Number(bookingInfo.specialOffer.price))}</div>
                      </li>
                    ) : (
                      <li className="flex justify-between">
                        <div>
                          <div className="font-medium">{bookingInfo.room?.roomName}</div>
                          <div className="text-sm text-gray-500">{bookingInfo.options?.bedType} 베드, {bookingInfo.room?.viewType}</div>
                        </div>
                        <div className="font-medium">₩{safe(priceInfo?.subtotal)}</div>
                      </li>
                    )}
                    {bookingInfo.options?.adultBreakfast > 0 && (
                      <li className="flex justify-between">
                        <div>
                          <div className="font-medium">성인 조식</div>
                          <div className="text-sm text-gray-500">{bookingInfo.options.adultBreakfast}명</div>
                        </div>
                        <div className="font-medium">₩{safe(bookingInfo.pricing?.adultBreakfastPrice)}</div>
                      </li>
                    )}
                    {bookingInfo.options?.childBreakfast > 0 && (
                      <li className="flex justify-between">
                        <div>
                          <div className="font-medium">어린이 조식</div>
                          <div className="text-sm text-gray-500">{bookingInfo.options.childBreakfast}명</div>
                        </div>
                        <div className="font-medium">₩{safe(bookingInfo.pricing?.childBreakfastPrice)}</div>
                      </li>
                    )}
                  </ul>
                  <div className="border-t mt-6 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">소계</span>
                      <span>₩{safe(priceInfo?.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{memberLabel}</span>
                      <span className="text-red-500">-₩{safe(priceInfo?.discount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base border-t pt-2">
                      <span>총 결제 금액</span>
                      <span>₩{safe(priceInfo?.total)}</span>
                    </div>
                  </div>

                </aside>

              )}

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

