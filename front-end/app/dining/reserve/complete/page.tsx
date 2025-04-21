"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Copy } from "lucide-react"  // ← 아이콘 import

export default function ReservationCompletePage() {
  const [reservationNum, setReservationNum] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("reservationResult")
    if (data) {
      try {
        const parsed = JSON.parse(data)
        const reservation = typeof parsed === "string" ? parsed : parsed.reservationNum
        setReservationNum(reservation)
      } catch (e) {
        console.error("Failed to parse reservation data", e)
      }
    }
  }, [])
  

  const handleCopy = () => {
    if (!reservationNum) return
    navigator.clipboard.writeText(reservationNum)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => alert("복사에 실패했습니다."))
  }

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">예약이 완료되었습니다!</h1>
      <p className="text-lg text-gray-700 mb-6">
        예약해 주셔서 감사합니다. 아래의 예약번호를 확인해 주세요.
      </p>

      {reservationNum ? (
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="bg-teal-100 text-teal-800 font-mono text-xl p-4 rounded flex items-center gap-2">
            예약번호: {reservationNum}
            <button onClick={handleCopy} className="ml-2 hover:text-teal-600 transition-colors">
              <Copy size={20} />
            </button>
          </div>
          {copied && <p className="text-sm text-green-600">복사되었습니다!</p>}
        </div>
      ) : (
        <p className="text-red-500">예약번호를 불러오지 못했습니다.</p>
      )}

      <Link
        href="/dining"
        className="mt-6 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors"
      >
        다이닝 페이지로 돌아가기
      </Link>
    </div>
  )
}
