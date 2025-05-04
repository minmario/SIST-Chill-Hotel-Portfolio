"use client"

export const dynamic = "force-dynamic";

import React from "react";
import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, Minus, Plus, Search } from "lucide-react"
import styles from "../../rooms/rooms.module.css"
import { extractMembershipIdxFromToken } from "./jwt";

export default function BookingInfo() {
  return (
    <Suspense>
      <BookingInfoContent />
    </Suspense>
  );
}

function BookingInfoContent() {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingParams, setBookingParams] = useState<any>(null);
  const [specialOffer, setSpecialOffer] = useState<any>(null);
  const [bedType, setBedType] = useState("킹");
  const [adultBreakfast, setAdultBreakfast] = useState(0);
  const [childBreakfast, setChildBreakfast] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loginOption, setLoginOption] = useState("member");
  // membership_idx 상태 추가
  const [membershipIdx, setMembershipIdx] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 로컬 스토리지에서 예약 정보 불러오기
  useEffect(() => {
    if (!hasMounted) return;
    const roomData = localStorage.getItem("selectedRoom")
    const paramsData = localStorage.getItem("bookingParams")
    const offerData = localStorage.getItem("selectedSpecialOffer")

    if (roomData) {
      setSelectedRoom(JSON.parse(roomData))
    } else {
      router.push("/booking")
    }

    if (paramsData) {
      setBookingParams(JSON.parse(paramsData))
    }

    if (offerData) {
      try {
        setSpecialOffer(JSON.parse(offerData))
      } catch (e) {
        setSpecialOffer(null)
      }
    } else {
      setSpecialOffer(null)
    }

    // accessToken에서 membershipIdx 추출(JWT 디코딩)
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      const idx = extractMembershipIdxFromToken(accessToken)
      console.log('[BookingInfo] membershipIdx 추출:', idx)
      setMembershipIdx(idx)
    } else {
      setMembershipIdx(null)
    }
  }, [hasMounted, router]);

  if (!selectedRoom || !bookingParams) {
    return <div className="container py-20 text-center">로딩 중...</div>
  }

  // specialOffer가 있으면 카드로 표시e
  // 카드 스타일은 객실/오퍼 카드와 동일하게 맞춤
  const renderSpecialOfferCard = () => {
    if (!specialOffer) return null;
    return (
      <div className="border rounded-lg overflow-hidden shadow-md mb-8 max-w-xl mx-auto">
        <div className="relative w-full h-60">
          <Image
            src={specialOffer.image || "/main_room.png"}
            alt={specialOffer.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">{specialOffer.title}</h3>
          <p className="text-sm text-gray-600">{specialOffer.subtitle}</p>
          {specialOffer.intro && (
            <div className="text-sm text-gray-700">{specialOffer.intro}</div>
          )}
        </div>
      </div>
    );
  };


  const handleAdultBreakfastChange = (value: number) => {
    const maxAdults = Number.parseInt(bookingParams.adults)
    if (value >= 0 && value <= maxAdults) {
      setAdultBreakfast(value)
    }
  }

  const handleChildBreakfastChange = (value: number) => {
    const maxChildren = Number.parseInt(bookingParams.children)
    if (value >= 0 && value <= maxChildren) {
      setChildBreakfast(value)
    }
  }

  const calculateTotal = (savePercent = 0) => {
    const nights = calculateNights(bookingParams.checkIn, bookingParams.checkOut)
    const roomCount = (selectedRoom?.roomCount ?? 1)
    const nightAndCount = nights * roomCount 
    const basePrice = (selectedRoom?.weekPrice ?? selectedRoom?.price ?? 0) * nightAndCount
    const adultBreakfastPrice = 35000 * adultBreakfast * nightAndCount
    const childBreakfastPrice = 20000 * childBreakfast * nightAndCount
    const total = basePrice + adultBreakfastPrice + childBreakfastPrice

    // savePercent가 0이 아니면 해당 퍼센트로 할인
    const discount = savePercent > 0 ? Math.round(total * (savePercent / 100)) : 0;

    return {
      nights,
      roomPrice: basePrice,
      adultBreakfastPrice,
      childBreakfastPrice,
      adultBreakfast,
      childBreakfast,
      subtotal: total,
      discount,
      total: total - discount,
    }
  }
  const calculateNights = (checkIn: string, checkOut: string): number => {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diffTime = outDate.getTime() - inDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return Math.max(diffDays, 1) // 최소 1박
  }

  const handleContinue = async () => {
    // 회원 예약인데 로그인 상태가 아니면 로그인 페이지로 이동
    if (loginOption === "member" && membershipIdx == null) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)
      return
    }
    // 예약 정보 저장
    const bookingInfo = {
      membership_idx: membershipIdx,
      specialOffer: specialOffer ?? null, // specialOffer 정보도 bookingInfo에 저장
      room: selectedRoom,
      roomIdx: selectedRoom.roomIdx, // ✅ 추가: 백엔드로 보낼 roomIdx
      roomTypesIdx: specialOffer?.roomTypesIdx ?? selectedRoom.roomTypesIdx, // 백엔드에서 필요하다면 이것도
      params: bookingParams,
      roomCount: selectedRoom.roomCount,
      options: {
        bedType,
        adultBreakfast,
        childBreakfast,
        specialRequests,
      },
      pricing: calculateTotal(),
      // membership_idx도 예약 정보에 포함
     
    }
    localStorage.setItem("bookingInfo", JSON.stringify(bookingInfo))

    if (loginOption === "member") {
      // accessToken이 없으면 로그인 페이지로 이동
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        router.push("/booking/login")
        return
      }
      // 회원 정보 불러오기
      try {
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (res.ok) {
          const userInfo = await res.json()
          // 회원 정보도 localStorage에 저장해서 customer-info에서 활용
          localStorage.setItem("bookingUserInfo", JSON.stringify(userInfo))
          router.push("/booking/customer-info")
        } else {
          router.push("/booking/login")
        }
      } catch (err) {
        alert("회원 정보 조회 중 오류 발생.")
        router.push("/booking/login")
      }
    } else {
      // 비회원 예약: 바로 customer-info로 이동 (토큰 없어도 에러 없음)
      router.push("/booking/customer-info")
    }
  }

  // 회원 정보 로딩 및 할인율 추출
  let memberDiscountPercent = 0;
  let isMemberLoggedIn = false;
  let memberLabel = "회원 등급 할인";

  // membershipIdx 값에 따라 할인율 결정
  if (typeof window !== "undefined") {
    // JWT에서 membershipIdx 추출 (이미 상태로 관리 중)
    const idx = typeof membershipIdx === 'number' ? membershipIdx : null;
    if (idx !== null) {
      isMemberLoggedIn = true;
      switch (idx) {
        case 1:
          memberDiscountPercent = 3;
          break;
        case 2:
          memberDiscountPercent = 5;
          break;
        case 3:
          memberDiscountPercent = 7;
          break;
        case 4:
          memberDiscountPercent = 10;
          break;
        default:
          memberDiscountPercent = 0;
      }
      memberLabel = `회원 등급 할인 (${memberDiscountPercent}%)`;
    }
  }


  // specialOffer.price가 있으면 예약 내역 금액에 무조건 오퍼가를 사용
  const priceInfo = (() => {
    const base = calculateTotal(memberDiscountPercent);
    if (specialOffer && specialOffer.price) {
      // 오퍼가 + 조식 가격을 합산, 회원이면 할인까지 적용
      const offerPrice = Number(specialOffer.price);
      const totalBreakfast = base.adultBreakfastPrice + base.childBreakfastPrice;
      const subtotal = offerPrice + totalBreakfast;
      let discount = 0;
      let total = subtotal;
      if (isMemberLoggedIn && memberDiscountPercent > 0) {
        discount = Math.round(subtotal * (memberDiscountPercent/100));
        total = subtotal - discount;
      }
      return {
        ...base,
        roomPrice: offerPrice,
        subtotal,
        discount,
        total,
      };
    }
    
    return base;
  })();

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>객실 예약</h1>
          <p>객실 옵션을 선택하고 예약을 진행하세요.</p>
        </div>
      </div>

      <section className={styles.bookingInfoSection}>
        <div className="container">
          <div className={styles.bookingSteps}>
            <div className={`${styles.bookingStep} ${styles.bookingStepCompleted}`}>
              <div className={styles.bookingStepNumber}>
                <Check size={16} />
              </div>
              <div className={styles.bookingStepLabel}>객실 선택</div>
            </div>
            <div className={`${styles.bookingStep} ${styles.bookingStepActive}`}>
              <div className={styles.bookingStepNumber}>2</div>
              <div className={styles.bookingStepLabel}>옵션 선택</div>
            </div>
            <div className={styles.bookingStep}>
              <div className={styles.bookingStepNumber}>3</div>
              <div className={styles.bookingStepLabel}>정보 입력</div>
            </div>
            <div className={styles.bookingStep}>
              <div className={styles.bookingStepNumber}>4</div>
              <div className={styles.bookingStepLabel}>예약 완료</div>
            </div>
          </div>

          <div className={styles.bookingInfoGrid}>
            <div className={styles.bookingInfoLeft}>
              {specialOffer && (
                <>
                <div className={styles.bookingSummaryCard} style={{ marginBottom: 24, padding: 16, border: '1px solid #eee', borderRadius: 12, background: '#fafbfc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Image
                      src={specialOffer.image || "/main_room.png"}
                      alt={specialOffer.title}
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{specialOffer.title}</div>
                      <div style={{ color: '#666', fontSize: 14 }}>{specialOffer.subtitle}</div>
                      {specialOffer.intro && <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{specialOffer.intro}</div>}
                    </div>
                  </div>
                </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 8 }}>
                      <span className="font-semibold">상품명: </span>
                      <span>{specialOffer.title}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span className="font-semibold">간략 설명: </span>
                      <span>{specialOffer.subtitle}</span>
                    </div>
                    {specialOffer.intro && (
                      <div style={{ marginBottom: 8 }}>
                        <span className="font-semibold">상세 안내: </span>
                        <span>{specialOffer.intro}</span>
                      </div>
                    )}
                    {(specialOffer.startDate || specialOffer.endDate) && (
                      <div style={{ marginBottom: 8 }}>
                        <span className="font-semibold">적용 기간: </span>
                        <span>{specialOffer.startDate} ~ {specialOffer.endDate}</span>
                      </div>
                    )}
                    {specialOffer.price && (
                      <div style={{ marginBottom: 8 }}>
                        <span className="font-semibold">스페셜 오퍼가: </span>
                        <span>₩{Number(specialOffer.price).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className={styles.bookingInfoCard}>
                <h2 className={styles.bookingInfoCardTitle}>예약 정보</h2>

                <div className={styles.selectedRoomInfo}>
                  <div className={styles.selectedRoomImageContainer}>
                    <Image
                      src={selectedRoom.roomImage || "/placeholder.svg"}
                      alt={selectedRoom.roomName}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className={styles.selectedRoomDetails}>
                    <h3 className={styles.selectedRoomName}>객실 이름: {selectedRoom.roomName}</h3>
                    <p className={styles.selectedRoomDates}>
                      체크인: {bookingParams.checkIn} / 체크아웃: {bookingParams.checkOut}
                    </p>
                    <p className={styles.selectedRoomGuests}>
                      객실 {bookingParams.roomCount}개 / 성인 {bookingParams.adults}명
                      {Number.parseInt(bookingParams.children) > 0 ? `, 어린이 ${bookingParams.children}명` : ""}
                    </p>

                    <button className={styles.searchAgainButton} onClick={() => router.push("/booking")}>
                      <Search size={14} /> 객실 다시 검색
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">침대 타입 선택</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="bedType"
                        value="킹"
                        checked={bedType === "킹"}
                        onChange={(e) => setBedType(e.target.value)}
                      />
                      킹 베드
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="bedType"
                        value="트윈"
                        checked={bedType === "트윈"}
                        onChange={(e) => setBedType(e.target.value)}
                      />
                      트윈 베드
                    </label>
                  </div>
                </div>

                <div className={styles.breakfastOptions}>
                  <h3 className={styles.breakfastTitle}>조식 추가</h3>

                  <div className={styles.breakfastOption}>
                    <div className={styles.breakfastOptionInfo}>
                      <div className={styles.breakfastOptionName}>성인 조식</div>
                      <div className={styles.breakfastOptionPrice}>₩35,000 / 1인</div>
                    </div>

                    <div className={styles.breakfastQuantity}>
                      <button
                        className={styles.breakfastQuantityButton}
                        onClick={() => handleAdultBreakfastChange(adultBreakfast - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        className={styles.breakfastQuantityInput}
                        value={adultBreakfast}
                        onChange={(e) => handleAdultBreakfastChange(Number.parseInt(e.target.value) || 0)}
                        min="0"
                        max={Number.parseInt(bookingParams.adults)}
                      />
                      <button
                        className={styles.breakfastQuantityButton}
                        onClick={() => handleAdultBreakfastChange(adultBreakfast + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {Number.parseInt(bookingParams.children) > 0 && (
                    <div className={styles.breakfastOption}>
                      <div className={styles.breakfastOptionInfo}>
                        <div className={styles.breakfastOptionName}>어린이 조식</div>
                        <div className={styles.breakfastOptionPrice}>₩20,000 / 1인</div>
                      </div>

                      <div className={styles.breakfastQuantity}>
                        <button
                          className={styles.breakfastQuantityButton}
                          onClick={() => handleChildBreakfastChange(childBreakfast - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          className={styles.breakfastQuantityInput}
                          value={childBreakfast}
                          onChange={(e) => handleChildBreakfastChange(Number.parseInt(e.target.value) || 0)}
                          min="0"
                          max={Number.parseInt(bookingParams.children)}
                        />
                        <button
                          className={styles.breakfastQuantityButton}
                          onClick={() => handleChildBreakfastChange(childBreakfast + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.specialRequestsContainer}>
                  <h3 className={styles.specialRequestsTitle}>특별 요청사항</h3>
                  <textarea
                    className={styles.specialRequestsTextarea}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="객실 또는 투숙과 관련된 특별 요청사항이 있으시면 입력해 주세요."
                  />
                </div>
              </div>
            </div>
            <div className={styles.bookingSummary} style={{ minWidth: '340px', maxWidth: '400px', marginLeft: '32px' }}>
              <h2 className={styles.bookingSummaryTitle}>예약 내역</h2>

              <div className={styles.bookingSummaryRow}>
                <span className={styles.bookingSummaryLabel}>객실 요금</span>
                <span className={styles.bookingSummaryValue}>₩{priceInfo.roomPrice.toLocaleString()}</span>
              </div>

              {adultBreakfast > 0 && (
                <div className={styles.bookingSummaryRow}>
                  <span className={styles.bookingSummaryLabel}>성인 조식 ({adultBreakfast}명)</span>
                  <span className={styles.bookingSummaryValue}>₩{priceInfo.adultBreakfastPrice.toLocaleString()}</span>
                </div>
              )}

              {childBreakfast > 0 && (
                <div className={styles.bookingSummaryRow}>
                  <span className={styles.bookingSummaryLabel}>어린이 조식 ({childBreakfast}명)</span>
                  <span className={styles.bookingSummaryValue}>₩{priceInfo.childBreakfastPrice.toLocaleString()}</span>
                </div>
              )}

              <div className={styles.bookingSummaryRow}>
                <span className={styles.bookingSummaryLabel}>소계</span>
                <span className={styles.bookingSummaryValue}>₩{priceInfo.subtotal.toLocaleString()}</span>
              </div>

              {isMemberLoggedIn && priceInfo.discount > 0 && (
                <div className={styles.bookingSummaryRow}>
                  <span className={styles.bookingSummaryLabel}>{memberLabel}</span>
                  <span className={styles.membershipDiscount} style={{ color: '#e53935', fontWeight: 600 }}>-₩{priceInfo.discount.toLocaleString()}</span>
                </div>
              )}

              <div className={styles.bookingSummaryTotal}>
                <span className={styles.bookingSummaryTotalLabel}>총 결제 금액</span>
                <span className={styles.bookingSummaryTotalValue}>₩{priceInfo.total.toLocaleString()}</span>
              </div>

              <button className={`button button-primary ${styles.bookingButton}`} onClick={handleContinue}>
                예약하기
              </button>

              <div className={styles.bookingInfoCard} style={{ marginTop: 16 }}>
                <h2 className={styles.bookingInfoCardTitle}>로그인 옵션</h2>
                <div className={styles.loginOptions}>
                  <label
                    className={`${styles.loginOption} ${loginOption === "member" ? styles.loginOptionSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name="loginOption"
                      value="member"
                      className={styles.loginOptionRadio}
                      checked={loginOption === "member"}
                      onChange={() => setLoginOption("member")}
                    />
                    <span className={styles.loginOptionLabel}>회원 예약</span>
                  </label>
                  <label
                    className={`${styles.loginOption} ${loginOption === "nonMember" ? styles.loginOptionSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name="loginOption"
                      value="nonMember"
                      className={styles.loginOptionRadio}
                      checked={loginOption === "nonMember"}
                      onChange={() => setLoginOption("nonMember")}
                      disabled={membershipIdx !== null} // 로그인 시 비회원 예약 비활성화
                    />
                    <span className={styles.loginOptionLabel} style={membershipIdx !== null ? { color: '#aaa', cursor: 'not-allowed' } : {}}>
                      비회원 예약{membershipIdx !== null ? ' (로그인 시 선택 불가)' : ''}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}