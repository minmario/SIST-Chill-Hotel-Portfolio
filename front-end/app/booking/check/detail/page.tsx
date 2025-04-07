"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer, Download } from "lucide-react"
import Link from "next/link"

export default function BookingDetailPage() {
  const router = useRouter()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 예약 정보 가져오기
    const bookingData = localStorage.getItem("bookingData")
    if (bookingData) {
      setBooking(JSON.parse(bookingData))
    }
    setLoading(false)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // 예약 정보를 텍스트 파일로 다운로드
    if (!booking) return

    const bookingInfo = `
      예약 번호: ${booking.bookingNumber}
      예약자: ${booking.name}
      객실: ${booking.roomType}
      체크인: ${booking.checkIn}
      체크아웃: ${booking.checkOut}
      인원: ${booking.guests}
      가격: ${booking.price}
    `

    const blob = new Blob([bookingInfo], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `예약정보_${booking.bookingNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCancelBooking = () => {
    if (confirm("정말로 예약을 취소하시겠습니까?")) {
      // 실제 구현에서는 API 호출로 예약 취소 처리
      alert("예약이 취소되었습니다.")
      router.push("/booking/check")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-color mx-auto"></div>
            <p className="mt-4 text-lg">예약 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-20 px-4 min-h-screen">
        <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">예약 정보</h1>
          <div className="text-center py-10">
            <p className="text-lg mb-4">예약 정보를 찾을 수 없습니다.</p>
            <Link href="/booking/check" className="button button-primary">
              예약 조회 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-20 px-4 min-h-screen">
      <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">예약 상세 정보</h1>
          <div className="flex gap-2">
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
              <p className="font-medium">{booking.bookingNumber}</p>
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
              <p className="text-gray-500 text-sm">예약자</p>
              <p className="font-medium">{booking.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">연락처</p>
              <p className="font-medium">{booking.phone}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">이메일</p>
              <p className="font-medium">{booking.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">객실 정보</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">객실 타입</p>
                <p className="font-medium">{booking.roomType}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">인원</p>
                <p className="font-medium">{booking.guests}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">체크인</p>
                <p className="font-medium">{booking.checkIn}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">체크아웃</p>
                <p className="font-medium">{booking.checkOut}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">결제 방법</p>
                <p className="font-medium">신용카드</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">결제 상태</p>
                <p className="font-medium">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    결제 완료
                  </span>
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500 text-sm">총 결제 금액</p>
                <p className="font-medium text-xl">{booking.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Link href="/booking/check" className="button button-outline flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            돌아가기
          </Link>
          <button onClick={handleCancelBooking} className="button button-danger">
            예약 취소
          </button>
        </div>
      </div>
    </div>
  )
}

