"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function ReservationCompletePage() {
  const [reservationNum, setReservationNum] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("reservationResult")
    if (data) {
      try {
        const parsed = JSON.parse(data)
        setReservationNum(parsed.reservationNum)
      } catch (e) {
        console.error("Failed to parse reservation data")
      }
    }
  }, [])

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">예약이 완료되었습니다!</h1>
      <p className="text-lg text-gray-700 mb-6">
        예약해 주셔서 감사합니다. 아래의 예약번호를 확인해 주세요.
      </p>

      {reservationNum ? (
        <div className="bg-teal-100 text-teal-800 font-mono text-xl p-4 rounded inline-block mb-8">
          예약번호: {reservationNum}
        </div>
      ) : (
        <p className="text-red-500">예약번호를 불러오지 못했습니다.</p>
      )}

      <Link
        href="/dining"
        className="inline-block mt-6 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors"
      >
        다이닝 페이지로 돌아가기
      </Link>
    </div>
  )
}
