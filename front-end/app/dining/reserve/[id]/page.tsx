"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const restaurantList = [
  {
    id: 1,
    name: "라 테라스",
    description: "신선한 제철 식재료로 준비한 인터내셔널 뷔페 레스토랑. 아침, 점심, 저녁 다양한 요리를 즐기실 수 있습니다.",
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
  },
  // ... 아리아, 사쿠라 등 추가 가능
  {
    id: 2,
    name: "아리아",
    description: "정통 이탈리안 요리를 현대적으로 재해석한 파인 다이닝 레스토랑. 엄선된 와인 리스트와 함께 특별한 식사를 즐겨보세요.",
    location: "호텔 2층",
    image: "/placeholder.svg?height=400&width=600",
    hours: {
      lunch: "12:00-15:00",
      dinner: "18:00-22:00",
    },
    seats: 80,
    price: {
      adult: 120000,
      child: 60000,
    },
  },
  {
    id: 3,
    name: "사쿠라",
    description: "최고급 식재료로 준비한 정통 일식 오마카세. 숙련된 일본 요리사가 선보이는 계절 요리를 카운터에서 직접 즐겨보세요.",
    location: "호텔 3층",
    image: "/placeholder.svg?height=400&width=600",
    hours: {
      lunch: "12:00-14:30",
      dinner: "18:00-22:00",
    },
    seats: 30,
    price: {
      adult: 150000,
      child: 80000,
    },
  },
]

export default function DiningReservePage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = Number(params?.id)
  const restaurant = restaurantList.find((r) => r.id === restaurantId)

  const [step, setStep] = useState(1)
  const [date, setDate] = useState("")
  const [mealTime, setMealTime] = useState("lunch")
  const [time, setTime] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [request, setRequest] = useState("")

  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)
  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("ko-KR", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : ""

      const handleSubmit = async () => {
        const reservationData = {
          restaurantId: restaurant?.id, 
          reservationDate: date,
          mealTime,
          reservationTime: time,
          adults,
          children,
          firstName,
          lastName,
          phone,
          email,
          request,
        }
      
        try {
          const res = await fetch("http://localhost:8080/dining/reservation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservationData),
          })
      
          if (res.ok) {
            const result = await res.json()
            localStorage.setItem("reservationResult", JSON.stringify(result)) // 저장
            // alert(`예약이 완료되었습니다!\n예약번호: ${result.reservationNum}`)
            router.push("/dining/reserve/complete") // 또는 "/dining"
          } else {
            const errorText = await res.text()
            alert("예약 실패: " + errorText)
          }
        } catch (err) {
          alert("서버 오류가 발생했습니다.")
        }
      }
      

  if (!restaurant) return <div className="p-10 text-center">존재하지 않는 레스토랑입니다.</div>

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/dining" className="inline-block mb-4 text-sm text-gray-500 hover:text-gray-700">
        ← 다이닝 목록으로 돌아가기
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* 예약 폼 */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{restaurant.name} 예약</h1>
          <p className="text-gray-600 mb-8">{restaurant.description}</p>

          {step === 1 && (
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block font-medium mb-1">방문 날짜</label>
            <input type="date" className="w-full border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">식사 시간</label>
            <div className="flex gap-4">
              <label><input type="radio" value="lunch" checked={mealTime === "lunch"} onChange={() => setMealTime("lunch")} className="mr-2" />점심</label>
              <label><input type="radio" value="dinner" checked={mealTime === "dinner"} onChange={() => setMealTime("dinner")} className="mr-2" />저녁</label>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">시간 선택</label>
            <select className="w-full border p-2 rounded" value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">시간을 선택하세요</option>
              {(mealTime === "lunch" ? ["12:00", "12:30", "13:00"] : ["18:00", "18:30", "19:00", "19:30"]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">성인</label>
              <select className="w-full border p-2 rounded" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                {[...Array(10)].map((_, i) => <option key={i} value={i + 1}>{i + 1}명</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">어린이</label>
              <select className="w-full border p-2 rounded" value={children} onChange={(e) => setChildren(Number(e.target.value))}>
                {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}명</option>)}
              </select>
            </div>
          </div>
          <button onClick={next} className="mt-4 bg-teal-500 text-white px-4 py-2 rounded" disabled={!date || !time}>다음 단계</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 max-w-xl">
          <div><label className="block font-medium mb-1">성</label><input type="text" className="w-full border p-2 rounded" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          <div><label className="block font-medium mb-1">이름</label><input type="text" className="w-full border p-2 rounded" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div><label className="block font-medium mb-1">연락처</label><input type="tel" className="w-full border p-2 rounded" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div><label className="block font-medium mb-1">이메일</label><input type="email" className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="block font-medium mb-1">요청사항</label><textarea className="w-full border p-2 rounded" rows={3} value={request} onChange={(e) => setRequest(e.target.value)} /></div>
          <div className="flex gap-2"><button onClick={back} className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-5 py-2 rounded-md transition-colors">이전</button><button onClick={next} className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2 rounded-md shadow-md transition-colors" disabled={!lastName || !firstName || !phone || !email}>다음 단계</button></div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 max-w-xl">
          <div>
            <h2 className="font-semibold mb-2">예약 정보</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>날짜:</strong> {formatDate(date)}</li>
              <li><strong>식사 시간:</strong> {mealTime === "lunch" ? "점심" : "저녁"}</li>
              <li><strong>시간:</strong> {time}</li>
              <li><strong>인원:</strong> 성인 {adults}명, 어린이 {children}명</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">예약자 정보</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>이름:</strong> {lastName} {firstName}</li>
              <li><strong>연락처:</strong> {phone}</li>
              <li><strong>이메일:</strong> {email}</li>
              {request && <li><strong>요청사항:</strong> {request}</li>}
            </ul>
          </div>
          <div className="flex gap-2">
            <button onClick={back} className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-5 py-2 rounded-md transition-colors">이전</button>
            <button onClick={handleSubmit} className="bg-teal-500 text-white px-4 py-2 rounded">예약 완료</button>
          </div>
        </div>
      )}
        </div>

        {/* 호텔 정보 카드 */}
        <div className="bg-white rounded-lg shadow p-4">
          <Image src={restaurant.image} alt={restaurant.name} width={600} height={400} className="rounded mb-4" />
          <h2 className="text-lg font-semibold mb-2">호텔 정보</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>위치:</strong> {restaurant.location}</li>
            <li><strong>영업시간:</strong> 점심 {restaurant.hours.lunch}, 저녁 {restaurant.hours.dinner}</li>
            <li><strong>좌석 수:</strong> {restaurant.seats}석</li>
            <li><strong>가격:</strong> 성인 {restaurant.price.adult.toLocaleString()}원 / 어린이 {restaurant.price.child.toLocaleString()}원</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
