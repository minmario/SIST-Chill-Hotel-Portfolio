"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Copy, X } from "lucide-react"
import styles from "../../rooms/rooms.module.css"

export default function BookingComplete() {
  const router = useRouter()
  const [bookingInfo, setBookingInfo] = useState<any>(null)
  const [reservationNumber, setReservationNumber] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // 예약 정보 불러오기
    const info = localStorage.getItem("bookingInfo")

    if (info) {
      setBookingInfo(JSON.parse(info))

      // 예약 번호 생성 (실제로는 서버에서 생성)
      const randomNum = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
      setReservationNumber(`LX${randomNum}`)
    } else {
      router.push("/booking")
    }
  }, [router])

  const copyReservationNumber = () => {
    navigator.clipboard.writeText(reservationNumber)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  if (!bookingInfo) {
    return <div className="container py-20 text-center">로딩 중...</div>
  }

  return (
    <>
      <div className={styles.bookingCompleteModal}>
        <div className={styles.bookingCompleteContent}>
          <Link href="/" className={styles.bookingCompleteClose}>
            <X size={24} />
          </Link>

          <div className={styles.bookingCompleteHeader}>
            <div className={styles.bookingCompleteIcon}>
              <Check size={48} />
            </div>
            <h2 className={styles.bookingCompleteTitle}>예약이 완료되었습니다</h2>
            <p className={styles.bookingCompleteSubtitle}>예약 정보가 이메일로 발송되었습니다.</p>
          </div>

          <div className={styles.bookingCompleteInfo}>
            <div className={styles.bookingCompleteRow}>
              <span className={styles.bookingCompleteLabel}>예약 번호</span>
              <span className={styles.bookingCompleteValue}>
                {reservationNumber}
                <button className={styles.copyButton} onClick={copyReservationNumber}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </span>
            </div>

            <div className={styles.bookingCompleteRow}>
              <span className={styles.bookingCompleteLabel}>객실</span>
              <span className={styles.bookingCompleteValue}>{bookingInfo.room.roomName}</span>
            </div>

            <div className={styles.bookingCompleteRow}>
              <span className={styles.bookingCompleteLabel}>체크인</span>
              <span className={styles.bookingCompleteValue}>{bookingInfo.params.checkIn}</span>
            </div>

            <div className={styles.bookingCompleteRow}>
              <span className={styles.bookingCompleteLabel}>체크아웃</span>
              <span className={styles.bookingCompleteValue}>{bookingInfo.params.checkOut}</span>
            </div>

            <div className={styles.bookingCompleteRow}>
              <span className={styles.bookingCompleteLabel}>인원</span>
              <span className={styles.bookingCompleteValue}>
                성인 {bookingInfo.params.adults}명
                {Number.parseInt(bookingInfo.params.children) > 0 ? `, 어린이 ${bookingInfo.params.children}명` : ""}
              </span>
            </div>

            <div className={styles.bookingCompleteRow}>
              <span className={styles.bookingCompleteLabel}>결제 금액</span>
              <span className={styles.bookingCompleteValue}>
                ₩{typeof bookingInfo.pricing?.total === "number" ? bookingInfo.pricing.total.toLocaleString() : "-"}
              </span>
            </div>

            <div className={styles.bookingCompleteRow}>
              <span className={styles.bookingCompleteLabel}>결제 방법</span>
              <span className={styles.bookingCompleteValue}>신용카드</span>
            </div>
          </div>

          <div className={styles.bookingCompleteActions}>
            <Link href="/" className="button button-outline">
              메인으로
            </Link>
            <Link href="/booking/check" className="button button-primary">
              예약 확인
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

