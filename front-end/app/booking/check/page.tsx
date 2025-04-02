"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import styles from "./booking-check.module.css"

export default function BookingCheckPage() {
  const router = useRouter()
  const [searchType, setSearchType] = useState("bookingNumber")
  const [bookingNumber, setBookingNumber] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isClient) return

    // 실제 구현에서는 API 호출로 예약 정보 조회
    // 여기서는 로컬 스토리지에 예약 정보 저장
    const mockBookingData = {
      bookingNumber:
        bookingNumber ||
        "BK" +
          Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0"),
      name: name || "홍길동",
      phone: phone || "010-1234-5678",
      email: "example@email.com",
      roomType: "Chill Harmony Room",
      checkIn: "2023-12-15",
      checkOut: "2023-12-17",
      guests: "성인 2인",
      price: "₩450,000",
    }

    try {
      localStorage.setItem("bookingData", JSON.stringify(mockBookingData))
      router.push("/booking/check/detail")
    } catch (error) {
      console.error("예약 정보를 저장하는 중 오류가 발생했습니다:", error)
      alert("예약 정보 조회에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className={styles.header || "mb-8 text-center"}>
        <h1 className="text-3xl font-bold mb-2">예약 조회</h1>
        <p className="text-gray-600">예약 번호 또는 예약자 정보로 예약을 조회하실 수 있습니다.</p>
      </div>

      <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              searchType === "bookingNumber"
                ? "border-b-2 border-[#2dd4bf] text-[#2dd4bf]"
                : "border-b border-gray-200 text-gray-500"
            }`}
            onClick={() => setSearchType("bookingNumber")}
          >
            예약 번호로 조회
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              searchType === "guestInfo"
                ? "border-b-2 border-[#2dd4bf] text-[#2dd4bf]"
                : "border-b border-gray-200 text-gray-500"
            }`}
            onClick={() => setSearchType("guestInfo")}
          >
            예약자 정보로 조회
          </button>
        </div>

        <form onSubmit={handleSearch}>
          {searchType === "bookingNumber" ? (
            <div className="mb-6">
              <label htmlFor="bookingNumber" className="block mb-2 font-medium">
                예약 번호
              </label>
              <input
                type="text"
                id="bookingNumber"
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="예약 시 발급받은 예약 번호를 입력하세요"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 font-medium">
                  예약자 이름
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="예약자 이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block mb-2 font-medium">
                  연락처
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="예약 시 입력한 연락처를 입력하세요"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium text-white"
            style={{ backgroundColor: "#2dd4bf" }}
          >
            <Search size={18} />
            예약 조회하기
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>예약 관련 문의사항은 고객센터로 연락주세요.</p>
          <p className="mt-2">
            <Link href="/service" className="text-[#2dd4bf]">
              고객센터 바로가기
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

