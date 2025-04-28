"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import styles from "../../../../rooms/rooms.module.css"

export default function DiningBookingDetailPage() {
  const router = useRouter()
  const [diningInfo, setDiningInfo] = useState<any>(null)
  const [reservationNumber, setReservationNumber] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const info = localStorage.getItem("bookingData")
    if (info) {
      const parsed = JSON.parse(info)
      setDiningInfo(parsed)
      setReservationNumber(parsed.reservationNum || "")
    } else {
      router.push("/booking/check")
    }
  }, [router])

  const copyReservationNumber = () => {
    navigator.clipboard.writeText(reservationNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCancelReservation = async () => {
    if (!diningInfo?.reservationNum) return

    const confirmCancel = window.confirm("정말 예약을 취소하시겠습니까?")
    if (!confirmCancel) return

    try {
      const res = await fetch(`/api/dining/cancel?reservationNum=${diningInfo.reservationNum}`, {
        method: "POST",
      })

      const resultMessage = await res.text()

      if (res.ok) {
        alert(resultMessage)
        router.push("/dining")
      } else {
        alert(resultMessage) // 이미 취소된 예약입니다 등
      }
    } catch (error) {
      console.error("예약 취소 실패:", error)
      alert("예약 취소에 실패했습니다.")
    }
  }

  // ✅ 예약 상태 한글 변환 함수
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "예약 대기"
      case "CONFIRMED":
        return "예약 확정"
      case "CANCELLED":
        return "예약 취소"
      default:
        return "-"
    }
  }

  if (!diningInfo) {
    return <div className="container py-20 text-center">로딩 중...</div>
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">다이닝 예약 상세 조회</h1>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">예약 번호:</span>
            <span>
              {diningInfo.reservationNum || "-"}
              <button className="ml-2" onClick={copyReservationNumber}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-bold">예약자 이름:</span>
            <span>{`${diningInfo.firstName || ""} ${diningInfo.lastName || ""}`.trim() || "-"}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-bold">레스토랑 이름:</span>
            <span>{diningInfo.restaurantName || "-"}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-bold">예약 날짜:</span>
            <span>{diningInfo.reservationDate || "-"}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-bold">예약 시간:</span>
            <span>{diningInfo.reservationTime || "-"}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-bold">식사 시간:</span>
            <span>{diningInfo.mealTime || "-"}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="font-bold">인원:</span>
            <span>성인 {diningInfo.adults || 0}명 {Number(diningInfo.children) > 0 ? `, 어린이 ${diningInfo.children}명` : ""}</span>
          </div>

          {diningInfo.request && (
            <div className="flex justify-between mb-2">
              <span className="font-bold">요청사항:</span>
              <span>{diningInfo.request}</span>
            </div>
          )}

          <div className="flex justify-between mb-2">
            <span className="font-bold">예약 상태:</span>
            <span>{getStatusLabel(diningInfo.status)}</span>
          </div>
        </div>

        {/* 버튼 레이아웃 수정: 50%씩, gap */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/"
            className="flex-1 bg-white border border-gray-300 text-gray-700 text-center py-3 rounded-md font-semibold hover:bg-gray-100"
          >
            메인으로
          </Link>
          <button
            onClick={handleCancelReservation}
            className="flex-1 bg-red-500 text-white text-center py-3 rounded-md font-semibold hover:bg-red-600"
          >
            예약 취소
          </button>
        </div>
      </div>
    </div>
  )
}
