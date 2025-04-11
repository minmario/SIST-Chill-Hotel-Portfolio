"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function BookingCheckDetailPage() {
  const [booking, setBooking] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("bookingData")
    if (!stored) {
      alert("예약 정보를 찾을 수 없습니다.")
      router.push("/booking/check")
      return
    }

    setBooking(JSON.parse(stored))
  }, [router])

  if (!booking) return <div className="p-10 text-center">예약 정보를 불러오는 중입니다...</div>

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-center">예약 상세 조회</h1>

      <div className="bg-white shadow-md rounded p-6 space-y-4">
        <div><strong>예약 번호:</strong> {booking.reservationNum}</div>
        <div><strong>예약자 이름:</strong> {booking.fullName}</div>
        <div><strong>연락처:</strong> {booking.phone}</div>
        <div><strong>이메일:</strong> {booking.email}</div>
        <hr />
        <div><strong>객실명:</strong> {booking.roomName}</div>
        <div><strong>객실 등급:</strong> {booking.roomGrade}</div>
        <div><strong>체크인:</strong> {booking.checkInDate}</div>
        <div><strong>체크아웃:</strong> {booking.checkOutDate}</div>
        <div><strong>숙박일 수:</strong> {booking.totalNights}박</div>
        <div><strong>인원:</strong> 성인 {booking.adultCount}명 / 어린이 {booking.childCount}명</div>
        <div><strong>예약 상태:</strong> {booking.status}</div>
        <div className="text-right font-semibold text-lg">
          총 결제 금액: ₩{booking.totalPrice?.toLocaleString()}
        </div>
      </div>
    </div>
  )
}