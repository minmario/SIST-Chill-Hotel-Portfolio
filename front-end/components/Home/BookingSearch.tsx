"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BookingSearch() {
  const router = useRouter()
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [roomCount, setRoomCount] = useState(1)

  // 컴포넌트 마운트 시 체크인=오늘, 체크아웃=내일로 자동 설정
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setCheckInDate(todayStr);
    setCheckOutDate(tomorrowStr);
  }, []);

  const totalPeople = adults + children
  const maxPeople = roomCount * 4

  const handleRoomChange = (delta: number) => {
    const newRoomCount = roomCount + delta
    if (newRoomCount < 1) return
    const newMax = newRoomCount * 4
    if (totalPeople > newMax) {
      const adjusted = Math.max(1, newMax - children)
      setAdults(adjusted)
    }
    setRoomCount(newRoomCount)
  }

  const handleAdultsChange = (delta: number) => {
    const newAdults = adults + delta
    if (newAdults < 1 || newAdults + children > maxPeople) return
    setAdults(newAdults)
  }

  const handleChildrenChange = (delta: number) => {
    const newChildren = children + delta
    if (newChildren < 0 || adults + newChildren > maxPeople) return
    setChildren(newChildren)
  }

  const formatDate = (date: string | number | Date) => {
    const d = new Date(date)
    const day = d.getDate().toString().padStart(2, "0")
    const month = (d.getMonth() + 1).toString().padStart(2, "0")
    const year = d.getFullYear()
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
    return `${year}.${month}.${day} (${dayOfWeek})`
  }

  const handleSearch = () => {
    router.push(`/booking?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomCount=${roomCount}&adults=${adults}&children=${children}`)
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 my-8 max-w-6xl mx-auto -mt-20 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-3 border rounded-lg">
          <label className="block text-sm font-medium text-gray-600 mb-1">체크인</label>
          <input
            type="date"
            value={checkInDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="block w-full text-lg"
          />
          {checkInDate && (
            <p className="text-sm text-gray-500 mt-1">{formatDate(checkInDate)}</p>
          )}
        </div>

        <div className="p-3 border rounded-lg">
          <label className="block text-sm font-medium text-gray-600 mb-1">체크아웃</label>
          <input
            type="date"
            value={checkOutDate}
            min={checkInDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="block w-full text-lg"
          />
          {checkOutDate && (
            <p className="text-sm text-gray-500 mt-1">{formatDate(checkOutDate)}</p>
          )}
        </div>

        <div className="p-3 border rounded-lg">
          <label className="block text-sm font-medium text-gray-600 mb-1">객실</label>
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleRoomChange(-1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              disabled={roomCount <= 1}
            >
              -
            </button>
            <span className="text-lg">{roomCount}개</span>
            <button
              onClick={() => handleRoomChange(1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-3 border rounded-lg">
          <label className="block text-sm font-medium text-gray-600 mb-1">인원</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">성인</p>
              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={() => handleAdultsChange(-1)}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                  disabled={adults <= 1}
                >
                  -
                </button>
                <span>{adults}명</span>
                <button
                  onClick={() => handleAdultsChange(1)}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                  disabled={adults + children >= maxPeople}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">어린이</p>
              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={() => handleChildrenChange(-1)}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                  disabled={children <= 0}
                >
                  -
                </button>
                <span>{children}명</span>
                <button
                  onClick={() => handleChildrenChange(1)}
                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                  disabled={adults + children >= maxPeople}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            최대 {maxPeople}명 (객실당 최대 4명)
          </p>
        </div>

        <div className="p-3 flex items-center">
          <button
            onClick={handleSearch}
            className="w-full py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: "#2dd4bf" }}
          >
            검색
          </button>
        </div>
      </div>
    </div>
  )
} 