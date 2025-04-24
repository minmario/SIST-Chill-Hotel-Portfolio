"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function BookingCheckDetailPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("bookingData")
    if (!stored) {
      alert("예약 정보를 찾을 수 없습니다.")
      router.push("/booking/check")
      return
    }
    let parsed = null
    try {
      parsed = JSON.parse(stored)
    } catch (e) {
      parsed = null
    }
    // 배열이 아니면 배열로 변환
    if (parsed) {
      if (Array.isArray(parsed)) {
        setBookings(parsed)
      } else {
        setBookings([parsed])
      }
    }
  }, [router])

  if (!bookings || bookings.length === 0) return <div className="p-10 text-center">예약 정보를 불러오는 중입니다...</div>

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl" style={{ marginBottom: "50px" }}>
      <h1 className="text-2xl font-bold mb-6 text-center">예약 상세 조회</h1>
      <div className="space-y-8">
        {bookings.map((booking, idx) => (
          <div key={booking.reservationNum || idx} className="bg-white shadow-md rounded p-6 space-y-4">
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
            <div className="flex justify-between mt-8 gap-4">
              <button
                onClick={() => router.push("/")}
                className="w-1/2 py-3 rounded bg-gray-300 hover:bg-gray-400 text-black font-semibold"
              >
                메인으로
              </button>
              <button
                onClick={async () => {
                  const confirmCancel = confirm("정말 예약을 취소하시겠습니까?")
                  if (!confirmCancel) return
                  try {
                    const res = await fetch(`/api/reservations/cancel/${booking.reservationNum}`, {
                      method: "POST",
                    })
                    if (!res.ok) throw new Error("취소 실패")
                    alert("예약이 취소되었습니다.")
                    router.push("/")
                  } catch (err) {
                    alert("예약 취소 중 오류 발생")
                    console.error(err)
                  }
                }}
                className="w-1/2 py-3 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                예약 취소
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}