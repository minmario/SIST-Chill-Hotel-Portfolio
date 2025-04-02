"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function DiningReservePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isClient, setIsClient] = useState(false)

  // 1단계: 날짜 및 인원 선택
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [mealTime, setMealTime] = useState("lunch") // lunch 또는 dinner

  // 2단계: 예약자 정보
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [request, setRequest] = useState("")

  // 3단계: 이용약관 동의
  const [agreeTerms, setAgreeTerms] = useState(false)

  // 레스토랑 정보
  const restaurant = {
    name: "라 테라스",
    location: "호텔 1층",
    image: "/placeholder.svg?height=400&width=600",
    hours: {
      lunch: "아침 06:30-10:30, 점심 12:00-14:30",
      dinner: "저녁 18:00-22:00",
    },
    seats: 150,
    price: {
      adult: 95000,
      child: 55000,
    },
  }

  useEffect(() => {
    setIsClient(true)

    // 로컬 스토리지에서 이전 예약 정보 불러오기
    try {
      const savedReservation = localStorage.getItem("diningReservation")
      if (savedReservation) {
        const data = JSON.parse(savedReservation)
        if (data.date) setDate(data.date)
        if (data.time) setTime(data.time)
        if (data.adults) setAdults(data.adults)
        if (data.children) setChildren(data.children)
        if (data.mealTime) setMealTime(data.mealTime)
        if (data.name) setName(data.name)
        if (data.phone) setPhone(data.phone)
        if (data.email) setEmail(data.email)
        if (data.request) setRequest(data.request)
      }
    } catch (error) {
      console.error("예약 정보를 불러오는 중 오류가 발생했습니다:", error)
    }
  }, [])

  const saveReservationData = () => {
    if (!isClient) return

    try {
      const reservationData = {
        restaurant: restaurant.name,
        date,
        time,
        adults,
        children,
        mealTime,
        name,
        phone,
        email,
        request,
        totalPrice: adults * restaurant.price.adult + children * restaurant.price.child,
      }

      localStorage.setItem("diningReservation", JSON.stringify(reservationData))
    } catch (error) {
      console.error("예약 정보를 저장하는 중 오류가 발생했습니다:", error)
    }
  }

  const handleNextStep = () => {
    saveReservationData()
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveReservationData()
    router.push("/dining/reserve/complete")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]

    return `${year}-${month}-${day} (${dayOfWeek})`
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/dining" className="inline-flex items-center text-gray-600 mb-6">
        <ArrowLeft size={16} className="mr-2" />
        다이닝 목록으로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-2">라 테라스 예약</h1>
      <p className="text-gray-600 mb-8">
        신선한 제철 식재료로 준비한 인터내셔널 뷔페 레스토랑. 아침, 점심, 저녁 다양한 요리를 즐기실 수 있습니다.
      </p>

      {/* 예약 단계 표시 */}
      <div className="flex items-center justify-center mb-8">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#2dd4bf] text-white" : "bg-gray-200 text-gray-600"}`}
        >
          1
        </div>
        <div className={`h-1 w-16 ${step >= 2 ? "bg-[#2dd4bf]" : "bg-gray-200"}`}></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#2dd4bf] text-white" : "bg-gray-200 text-gray-600"}`}
        >
          2
        </div>
        <div className={`h-1 w-16 ${step >= 3 ? "bg-[#2dd4bf]" : "bg-gray-200"}`}></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#2dd4bf] text-white" : "bg-gray-200 text-gray-600"}`}
        >
          3
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽: 예약 폼 */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">날짜 및 인원 선택</h2>
              <p className="text-gray-600 mb-4">방문하실 날짜, 시간, 인원수를 선택해주세요.</p>

              <form>
                <div className="mb-4">
                  <label htmlFor="date" className="block mb-2 font-medium">
                    날짜 선택
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  {date && <div className="mt-1 text-sm text-gray-600">{formatDate(date)}</div>}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">식사 시간</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mealTime"
                        value="lunch"
                        checked={mealTime === "lunch"}
                        onChange={() => setMealTime("lunch")}
                        className="mr-2"
                      />
                      점심
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mealTime"
                        value="dinner"
                        checked={mealTime === "dinner"}
                        onChange={() => setMealTime("dinner")}
                        className="mr-2"
                      />
                      저녁
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="time" className="block mb-2 font-medium">
                    시간 선택
                  </label>
                  <select
                    id="time"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    <option value="">시간을 선택해주세요</option>
                    {mealTime === "lunch" ? (
                      <>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="13:00">13:00</option>
                        <option value="13:30">13:30</option>
                        <option value="14:00">14:00</option>
                      </>
                    ) : (
                      <>
                        <option value="18:00">18:00</option>
                        <option value="18:30">18:30</option>
                        <option value="19:00">19:00</option>
                        <option value="19:30">19:30</option>
                        <option value="20:00">20:00</option>
                        <option value="20:30">20:30</option>
                        <option value="21:00">21:00</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">인원</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="adults" className="block mb-1 text-sm">
                        성인
                      </label>
                      <select
                        id="adults"
                        className="w-full p-3 border border-gray-300 rounded"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}명
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="children" className="block mb-1 text-sm">
                        어린이 (만 12세 이하)
                      </label>
                      <select
                        id="children"
                        className="w-full p-3 border border-gray-300 rounded"
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                      >
                        {[...Array(11)].map((_, i) => (
                          <option key={i} value={i}>
                            {i}명
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 mt-4 rounded-md font-medium text-white"
                  style={{ backgroundColor: "#2dd4bf" }}
                  disabled={!date || !time}
                >
                  다음 단계
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">예약자 정보</h2>
              <p className="text-gray-600 mb-4">예약자 정보를 입력해주세요.</p>

              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 font-medium">
                    성
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="성"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block mb-2 font-medium">
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 font-medium">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="request" className="block mb-2 font-medium">
                    요청사항 (선택)
                  </label>
                  <textarea
                    id="request"
                    className="w-full p-3 border border-gray-300 rounded"
                    rows={4}
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="특별한 요청사항이 있으시면 입력해주세요"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-3 border border-gray-300 rounded-md font-medium"
                  >
                    이전 단계
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-3 rounded-md font-medium text-white"
                    style={{ backgroundColor: "#2dd4bf" }}
                    disabled={!name || !phone || !email}
                  >
                    다음 단계
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">예약 확인</h2>
              <p className="text-gray-600 mb-4">예약 정보를 확인해주세요.</p>

              <div className="mb-6">
                <h3 className="font-medium mb-2">예약 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-500 text-sm">레스토랑:</div>
                    <div>{restaurant.name}</div>
                    <div className="text-gray-500 text-sm">날짜:</div>
                    <div>{formatDate(date)}</div>
                    <div className="text-gray-500 text-sm">시간:</div>
                    <div>{time}</div>
                    <div className="text-gray-500 text-sm">인원:</div>
                    <div>
                      성인 {adults}명, 어린이 {children}명
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">예약자 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-500 text-sm">이름:</div>
                    <div>{name}</div>
                    <div className="text-gray-500 text-sm">연락처:</div>
                    <div>{phone}</div>
                    <div className="text-gray-500 text-sm">이메일:</div>
                    <div>{email}</div>
                    {request && (
                      <>
                        <div className="text-gray-500 text-sm">요청사항:</div>
                        <div>{request}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">이용약관</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 h-40 overflow-y-auto text-sm">
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>예약 취소 및 변경은 예약 시간으로부터 24시간 전까지 가능합니다.</li>
                    <li>24시간 이내 취소 또는 노쇼(No-show)의 경우, 위약금이 발생할 수 있습니다.</li>
                    <li>예약 시간보다 15분 이상 늦을 경우, 예약이 취소될 수 있습니다.</li>
                    <li>레스토랑 사정에 따라 예약이 변경되거나 취소될 수 있으며, 이 경우 사전에 안내해 드립니다.</li>
                    <li>특별한 요청사항은 가능한 한 반영해 드리나, 보장되지 않을 수 있습니다.</li>
                    <li>개인정보는 예약 및 서비스 제공 목적으로만 사용되며, 예약 완료 후 3개월간 보관됩니다.</li>
                  </ol>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mr-2"
                  />
                  이용약관에 동의합니다.
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 border border-gray-300 rounded-md font-medium"
                >
                  이전 단계
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-md font-medium text-white"
                  style={{ backgroundColor: "#2dd4bf" }}
                  disabled={!agreeTerms}
                >
                  예약 완료
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 레스토랑 정보 */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">예약 정보</h2>

            <div className="mb-4">
              <Image
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>

            <h3 className="font-bold text-lg">{restaurant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{restaurant.location}</p>

            <div className="mt-4">
              <p className="text-sm font-medium">영업시간:</p>
              <p className="text-sm text-gray-600">
                {restaurant.hours.lunch}, 저녁 {restaurant.hours.dinner.split(" ")[1]}
              </p>
            </div>

            <div className="mt-2">
              <p className="text-sm font-medium">좌석:</p>
              <p className="text-sm text-gray-600">{restaurant.seats}석</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium">가격 안내</p>
              <p className="text-sm text-gray-600">
                성인: {restaurant.price.adult.toLocaleString()}원, 어린이: {restaurant.price.child.toLocaleString()}원
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <p>* 예약 확정 후 변경 및 취소는 예약 시간 24시간 전까지 가능합니다.</p>
              <p>* 특별 이벤트 및 프로모션은 별도 공지됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

