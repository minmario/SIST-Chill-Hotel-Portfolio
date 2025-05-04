"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import styles from "./booking-check.module.css"

export default function BookingCheckPage() {
  const router = useRouter()

  const [searchCategory, setSearchCategory] = useState<"hotel" | "dining">("hotel") // 호텔 or 다이닝
  const [searchType, setSearchType] = useState<"bookingNumber" | "guestInfo">("bookingNumber") // 예약번호 or 예약자 정보

  const [bookingNumber, setBookingNumber] = useState("")
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [phone, setPhone] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isClient) return

    try {
      let url = ""

      if (searchType === "bookingNumber") {
        if (!bookingNumber) {
          alert("예약 번호를 입력해주세요.")
          return
        }

        if (searchCategory === "hotel") {
          url = `/api/reservations/check-by-num?reservationNum=${bookingNumber}`
        } else {
          url = `/api/dining/check-by-num?reservationNum=${bookingNumber}`
        }
      } else {
        if (!lastName || !firstName || !phone) {
          alert("성, 이름, 연락처를 모두 입력해주세요.")
          return
        }

        if (searchCategory === "hotel") {
          url = `/api/reservations/check/guest?firstName=${firstName}&lastName=${lastName}&phone=${phone}`
        } else {
          url = `/api/dining/check/guest?firstName=${firstName}&lastName=${lastName}&phone=${phone}`
        }
      }

      const res = await fetch(url)
      if (!res.ok) throw new Error("예약 정보를 찾을 수 없습니다.")

      const data = await res.json()
      localStorage.setItem("bookingData", JSON.stringify(data))

      // ✅ hotel / dining에 따라 이동 경로 정확히 분기
      if (searchCategory === "hotel") {
        router.push("/booking/check/detail")
      } else {
        router.push("/booking/check/detail/dining")
      }
    } catch (error) {
      console.error("예약 조회 실패:", error)
      alert("예약 정보를 조회하지 못했습니다.")
    }
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className={styles.header || "mb-8 text-center"}>
        <h1 className="text-3xl font-bold mb-2">예약 조회</h1>
        <p className="text-gray-600">예약 번호 또는 예약자 정보로 예약을 조회하실 수 있습니다.</p>
      </div>

      <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* --- 호텔 / 다이닝 선택 필터 --- */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              searchCategory === "hotel"
                ? "border-b-2 border-[#2dd4bf] text-[#2dd4bf]"
                : "border-b border-gray-200 text-gray-500"
            }`}
            onClick={() => setSearchCategory("hotel")}
          >
            호텔 예약
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              searchCategory === "dining"
                ? "border-b-2 border-[#2dd4bf] text-[#2dd4bf]"
                : "border-b border-gray-200 text-gray-500"
            }`}
            onClick={() => setSearchCategory("dining")}
          >
            다이닝 예약
          </button>
        </div>

        {/* --- 예약번호 / 예약자 정보 선택 필터 --- */}
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

        {/* --- 검색 입력 폼 --- */}
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
              <div className="mb-4 flex gap-4">
                <div className="w-1/2">
                  <label htmlFor="firstName" className="block mb-2 font-medium">
                    성
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="성을 입력하세요"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="w-1/2">
                  <label htmlFor="lastName" className="block mb-2 font-medium">
                    이름
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="이름을 입력하세요"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
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
