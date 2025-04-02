"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Printer, Download, Check } from "lucide-react"

export default function DiningReserveCompletePage() {
  const [reservation, setReservation] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [reservationNumber, setReservationNumber] = useState("")

  useEffect(() => {
    setIsClient(true)

    // 예약 번호 생성
    const generateReservationNumber = () => {
      const date = new Date()
      const year = date.getFullYear().toString().slice(2)
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const day = date.getDate().toString().padStart(2, "0")
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
      return `D${year}${month}${day}${random}`
    }

    try {
      // 로컬 스토리지에서 예약 정보 불러오기
      const savedReservation = localStorage.getItem("diningReservation")
      if (savedReservation) {
        const data = JSON.parse(savedReservation)
        setReservation(data)

        // 예약 번호 생성 및 저장
        const number = generateReservationNumber()
        setReservationNumber(number)

        // 예약 정보에 예약 번호 추가하여 다시 저장
        const updatedReservation = { ...data, reservationNumber: number }
        localStorage.setItem("diningReservation", JSON.stringify(updatedReservation))
      }
    } catch (error) {
      console.error("예약 정보를 불러오는 중 오류가 발생했습니다:", error)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!reservation || !reservationNumber) return

    try {
      const reservationInfo = `
=== 다이닝 예약 확인서 ===

예약 번호: ${reservationNumber}
레스토랑: ${reservation.restaurant}
날짜: ${reservation.date}
시간: ${reservation.time}
인원: 성인 ${reservation.adults}명, 어린이 ${reservation.children}명

예약자: ${reservation.name}
연락처: ${reservation.phone}
이메일: ${reservation.email}
${reservation.request ? `요청사항: ${reservation.request}` : ""}

총 금액: ${reservation.totalPrice.toLocaleString()}원

* 예약 취소 및 변경은 예약 시간으로부터 24시간 전까지 가능합니다.
* 문의사항은 02-123-4567로 연락주세요.

감사합니다.
      `

      const blob = new Blob([reservationInfo], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `다이닝예약_${reservationNumber}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("예약 정보 다운로드 중 오류가 발생했습니다:", error)
      alert("예약 정보 다운로드에 실패했습니다.")
    }
  }

  if (!isClient || !reservation) {
    return (
      <div className="container mx-auto py-20 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2dd4bf] mx-auto"></div>
            <p className="mt-4 text-lg">예약 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 print-container">
      <div className="no-print mb-6">
        <Link href="/dining" className="inline-flex items-center text-gray-600">
          <ArrowLeft size={16} className="mr-2" />
          다이닝 목록으로 돌아가기
        </Link>
      </div>

      <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2dd4bf] rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold">예약이 완료되었습니다</h1>
          <p className="text-gray-600 mt-2">예약 확인 이메일이 {reservation.email}로 발송되었습니다.</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">예약 상세 정보</h2>
          <div className="flex gap-2 no-print">
            <button
              onClick={handlePrint}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="인쇄"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="다운로드"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        <div className="border-t border-b py-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">예약 번호</p>
              <p className="font-medium">{reservationNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">예약 상태</p>
              <p className="font-medium">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  예약 확정
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">레스토랑</p>
              <p className="font-medium">{reservation.restaurant}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">날짜 및 시간</p>
              <p className="font-medium">
                {reservation.date} {reservation.time}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">인원</p>
              <p className="font-medium">
                성인 {reservation.adults}명, 어린이 {reservation.children}명
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">예약자 정보</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">예약자</p>
                <p className="font-medium">{reservation.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">연락처</p>
                <p className="font-medium">{reservation.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">이메일</p>
                <p className="font-medium">{reservation.email}</p>
              </div>
              {reservation.request && (
                <div className="md:col-span-2">
                  <p className="text-gray-500 text-sm">요청사항</p>
                  <p className="font-medium">{reservation.request}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">결제 방법</p>
                <p className="font-medium">현장 결제</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">결제 상태</p>
                <p className="font-medium">
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    방문 시 결제
                  </span>
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-sm">예상 금액</p>
                <p className="font-medium text-xl">{reservation.totalPrice.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
          <h3 className="font-medium mb-2">안내사항</h3>
          <ul className="space-y-1 text-gray-600">
            <li>• 예약 변경 및 취소는 예약 시간으로부터 24시간 전까지 가능합니다.</li>
            <li>• 예약 시간보다 15분 이상 늦을 경우, 예약이 취소될 수 있습니다.</li>
            <li>• 특별 요청사항은 가능한 한 반영해 드리나, 상황에 따라 제한될 수 있습니다.</li>
            <li>• 문의사항은 02-123-4567로 연락주세요.</li>
          </ul>
        </div>

        <div className="text-center no-print">
          <Link
            href="/dining"
            className="inline-flex items-center justify-center py-3 px-6 rounded-md font-medium text-white"
            style={{ backgroundColor: "#2dd4bf" }}
          >
            확인
          </Link>
        </div>
      </div>
    </div>
  )
}

